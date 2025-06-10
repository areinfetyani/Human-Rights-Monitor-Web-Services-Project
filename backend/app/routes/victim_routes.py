import os
import base64
from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List
from bson import ObjectId
from app.database import db
from app.models import victim as model

router = APIRouter()

@router.get("/get_victims", response_model=List[model.VictimDB])
def list_all_victims():
    victims = []
    cursor = db.victims.find({})
    for doc in cursor:
        victims.append(victim_doc_to_model(doc))
    return victims


def victim_doc_to_model(doc) -> model.VictimDB:
    return model.VictimDB(
        id=str(doc["_id"]),
        type=doc.get("type", "victim"),
        anonymous=doc.get("anonymous", False),
        name=doc.get("name") if not doc.get("anonymous", False) else None, 
        demographics=doc.get("demographics"),
        contact_info=doc.get("contact_info"),
        support_services=doc.get("support_services"),
        cases_involved=doc.get("cases_involved"),
        created_at=doc["created_at"],
        updated_at=doc.get("updated_at"),
    )

@router.patch("/assign-case/{victim_id}")
def assign_case_to_victim(victim_id: str, payload: dict):
    case_id = payload.get("case_id")
    if not case_id:
        raise HTTPException(status_code=400, detail="Missing case_id")

    result = db.victims.update_one(
        {"_id": ObjectId(victim_id)},
        {"$addToSet": {"cases_involved": case_id}, "$set": {"updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Victim not found")

    return {"message": f"Victim {victim_id} assigned to case {case_id}"}

@router.get("/cases/with-victim-info")
def get_cases_with_victim_info():
    cases_with_victim = []
    for case in model.cases.find():
        case["_id"] = str(case["_id"])
        case["has_victims"] = bool(case.get("victims"))  # true if victims list exists and is not empty
        cases_with_victim.append(case)
    return cases_with_victim

@router.post("/{victim_id}/assign/{case_id}")
def assign_victim_to_case(victim_id: str, case_id: str):
    result = db.victims.update_one(
        {"_id": ObjectId(victim_id)},
        {"$addToSet": {"cases_involved": case_id}, "$set": {"updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Victim not found")
    return {"message": "Victim assigned to case successfully"}

@router.post("/")
def add_victim(victim: model.VictimCreate):
    now = datetime.utcnow()

    # Extract and remove risk_assessment from the victim object
    risk = victim.risk_assessment.dict() if victim.risk_assessment else None
    victim_dict = victim.dict(exclude={"risk_assessment"})

    victim_dict["created_at"] = now
    victim_dict["updated_at"] = now

    result = db.victims.insert_one(victim_dict)

    if risk:
        risk_doc = {
            "victim_id": str(result.inserted_id),
            **risk,
            "created_at": now,
            "updated_at": now
        }
        db.victim_risk_assessments.insert_one(risk_doc)

    new_victim = db.victims.find_one({"_id": result.inserted_id})
    return victim_doc_to_model(new_victim)

@router.get("/{victim_id}", response_model=model.VictimDB)
def get_victim(victim_id: str):
    try:
        obj_id = ObjectId(victim_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid victim ID")

    doc = db.victims.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Victim not found")

    return victim_doc_to_model(doc)


@router.patch("/{victim_id}", response_model=dict)
def update_risk_assessment(victim_id: str, risk: model.VictimUpdateRisk):
    try:
        ObjectId(victim_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid victim ID")

    update_data = {
        "level": risk.level,
        "threats": risk.threats,
        "protection_needed": risk.protection_needed,
        "updated_at": datetime.utcnow()
    }

    result = db.victim_risk_assessments.update_one(
        {"victim_id": victim_id}, {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Risk assessment not found or not updated")

    return {"message": "Risk assessment updated successfully"}

@router.get("/case/{case_id}", response_model=List[model.VictimDB])
def get_victims_by_case(case_id: str):
    docs = db.victims.find({"cases_involved": case_id})
    victims = []
    for doc in docs:
        victims.append(victim_doc_to_model(doc))
    return victims

@router.get("/", response_model=List[model.VictimDB])
def list_all_victims():
    victims = []
    cursor = db.victims.find({})
    for doc in cursor:
        victims.append(victim_doc_to_model(doc))
    return victims
