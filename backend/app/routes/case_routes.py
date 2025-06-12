import os
import base64
from fastapi import APIRouter, HTTPException
from datetime import datetime
from ..models import case_model as model
from typing import List, Optional
from bson import ObjectId

router = APIRouter()

def serialize_case(case):
    case["_id"] = str(case["_id"])
    if "victims" in case:
        case["victims"] = [str(v) if isinstance(v, ObjectId) else v for v in case["victims"]]
    if "created_by" in case and isinstance(case["created_by"], ObjectId):
        case["created_by"] = str(case["created_by"])
    return case

# @router.get("/")
# def get_all_cases():
#     return [serialize_case(case) for case in model.cases.find()]



@router.get("/archive")
def get_archive_cases():
    casesa = list(model.cases_archive.find())
    if not casesa:
        raise HTTPException(status_code=404, detail="No cases were archived!")
    return [serialize_case(case) for case in casesa]

@router.post("/")
def add_case(case: model.Case):
    now = datetime.utcnow()
    case.date_occurred = now
    case.date_reported = now
    case.created_at = now
    case.updated_at = now

    os.makedirs("Evidence", exist_ok=True)

    for evd in case.evidence:
        evd.date_captured = now
        if evd.url.startswith("data:"):
            try:
                header, encoded = evd.url.split(",", 1)
                file_ext = header.split("/")[1].split(";")[0]
                filename = f"{case.case_id}_{now.timestamp()}.{file_ext}"
                filepath = os.path.join("Evidence", filename)
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(encoded))
                evd.url = f"http://localhost:8000/Evidence/{filename}"
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error processing evidence file: {str(e)}")

    if case.victims:
        case.victims = [ObjectId(v) for v in case.victims if ObjectId.is_valid(v)]
    else:
        case.victims = []

    model.cases.insert_one(case.dict())

    for victim_id in case.victims:
        model.db.victims.update_one(
            {"_id": victim_id},
            {"$addToSet": {"cases_involved": case.case_id}}
        )

    return {"message": "✅ Case and evidence file saved successfully."}
@router.get("/status-history")
def get_all_status_changes():
    history = list(model.case_status_history.find())
    for entry in history:
        entry["_id"] = str(entry["_id"])
    return history

@router.get("/{case_id}")
def get_case_by_id(case_id: str):
    fetched_case = model.cases.find_one({"case_id": case_id})
    if fetched_case:
        return serialize_case(fetched_case)
    else:
        raise HTTPException(status_code=404, detail=f"The case with ID {case_id} was not found!")

@router.post("/filter")
def get_cases_by_filter(case: model.CaseFilter):
    filter_query = {}

    if case.violation_types:
        filter_query['violation_types'] = {"$in": case.violation_types}
    if case.status:
        filter_query['status'] = case.status
    if case.priority:
        filter_query['priority'] = case.priority
    if case.country:
        filter_query['location.country'] = case.country
    if case.region:
        filter_query['location.region'] = case.region
    if case.date_occurred_from and case.date_occurred_to:
        filter_query['date_occurred'] = {"$gte": case.date_occurred_from, "$lte": case.date_occurred_to}
    if case.victims:
        filter_query['victims'] = {"$in": case.victims}
    if case.created_by:
        filter_query['created_by'] = case.created_by
    if case.created_at:
        filter_query['created_at'] = case.created_at
    if case.updated_at:
        filter_query['updated_at'] = case.updated_at

    return [serialize_case(doc) for doc in model.cases.find(filter_query)]

@router.patch("/{case_id}")
def update_case_status(case_id: str, new_status: model.CaseStatus, user: str):
    case = model.cases.find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail=f"Case with ID {case_id} not found.")

    old_status = case["status"]
    now = datetime.utcnow()
    existing_history = model.case_status_history.find_one({"case_id": case_id})

    if not existing_history:
        status_record = {
            "case_id": case_id,
            "old_status": old_status,
            "new_status": new_status,
            "updated_by": user,
            "updated_at": now
        }
        model.case_status_history.insert_one(status_record)
    else:
        model.case_status_history.update_one(
            {"case_id": case_id},
            {"$set": {"new_status": new_status, "updated_by": user, "updated_at": now}}
        )

    model.cases.update_one(
        {"case_id": case_id},
        {"$set": {"status": new_status, "updated_at": now}}
    )

    return {"message": f"Case {case_id} status updated successfully."}

@router.delete("/{case_id}")
def delete_by_case_id(case_id: str):
    try:
        raw_case = model.cases.find_one({"case_id": case_id})
        if not raw_case:
            raise HTTPException(status_code=404, detail="The case is not found.")

        raw_case.pop("_id", None)
        raw_case["status"] = "archived"
        raw_case["archived_at"] = datetime.utcnow()

        # Ensure ObjectIds are converted to strings if needed
        if "victims" in raw_case:
            raw_case["victims"] = [str(v) for v in raw_case["victims"]]
        if isinstance(raw_case.get("created_by"), ObjectId):
            raw_case["created_by"] = str(raw_case["created_by"])

        archived_case = model.CaseArchive(**raw_case)
        model.cases_archive.insert_one(archived_case.dict())

        delete_result = model.cases.delete_one({"case_id": case_id})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=500, detail=f"Failed to delete case {case_id} from database.")

        model.case_status_history.update_one(
            {"case_id": case_id},
            {"$set": {"new_status": "archived", "updated_at": datetime.utcnow()}},
            upsert=True
        )

        return {"message": f"✅ Case {case_id} archived and deleted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/assign-victims/{case_id}")
def assign_victims_to_case(case_id: str, victim_ids: List[str]):
    from bson import ObjectId
    from ..models import case_model as model

    case = model.cases.find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

    # Merge existing victims with new ones
    existing = set(str(v) for v in case.get("victims", []))
    new_valid = [ObjectId(v) for v in victim_ids if ObjectId.is_valid(v)]
    merged = list(existing.union(str(v) for v in new_valid))

    model.cases.update_one({"case_id": case_id}, {"$set": {"victims": merged}})
    
    for vid in new_valid:
        model.db.victims.update_one(
            {"_id": vid},
            {"$addToSet": {"cases_involved": case_id}}
        )

    return {"message": f"✅ Victims assigned to case {case_id}"}