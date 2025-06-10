from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from typing import List, Optional
from datetime import datetime
import os, shutil, uuid

from app.models.report_model import (
    ReportStatus, ReporterType, PreferredContact,
    EvidenceType
)
from app.database import db

incident_reports = db["incident_reports"]
report_evidence = db["report_evidence"]

router = APIRouter()
UPLOAD_DIR = "Evidence"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def submit_report(
    report_id: str = Form(...),
    reporter_type: ReporterType = Form(...),
    anonymous: bool = Form(...),

    contact_email: Optional[str] = Form(None),
    contact_phone: Optional[str] = Form(None),
    preferred_contact: Optional[PreferredContact] = Form(None),

    incident_date: datetime = Form(...),
    location_country: str = Form(...),
    location_city: str = Form(...),
    location_lat: float = Form(...),
    location_lng: float = Form(...),

    description: str = Form(...),
    violation_types: List[str] = Form(...),

    assigned_to: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None)
):
    try:
        # Clean and prepare fields
        clean_report_id = report_id.strip()
        clean_reporter_type = reporter_type.value.strip()
        clean_assigned_to = (assigned_to or "").strip()
        clean_status = ReportStatus.NEW.value.strip()

        report_dict = {
            "report_id": clean_report_id,
            "reporter_type": clean_reporter_type,
            "anonymous": anonymous,
            "contact_info": {
                "email": contact_email.strip() if contact_email else None,
                "phone": contact_phone.strip() if contact_phone else None,
                "preferred_contact": preferred_contact.value if preferred_contact else None
            },
            "incident_details": {
                "date": incident_date,
                "location": {
                    "country": location_country.strip(),
                    "city": location_city.strip(),
                    "coordinates": {
                        "type": "Point",
                        "coordinates": [location_lat, location_lng]
                    }
                }
            },
            "violation_types": [v.strip() for v in violation_types],
            "evidence": [],
            "status": clean_status,
            "assigned_to": clean_assigned_to,
            "created_at": datetime.utcnow()
        }

        saved_evidence = []

        if files:
            for f in files:
                ext = f.filename.split('.')[-1]
                unique_name = f"{clean_report_id}_{uuid.uuid4().hex}.{ext}"
                filepath = os.path.join(UPLOAD_DIR, unique_name)

                with open(filepath, "wb") as buffer:
                    shutil.copyfileobj(f.file, buffer)

                type_key = f.content_type.split("/")[0]
                ev_type = EvidenceType(type_key)

                evidence_item = {
                    "report_id": clean_report_id,
                    "type": ev_type.value,
                    "url": f"http://localhost:8000/{UPLOAD_DIR}/{unique_name}",
                    "description": f.filename.strip()
                }

                saved_evidence.append(evidence_item)

        report_dict["evidence"] = saved_evidence
        incident_reports.insert_one(report_dict)

        if saved_evidence:
            report_evidence.insert_many(saved_evidence)

        return {
            "message": "Report submitted successfully",
            "report_id": clean_report_id,
            "evidence_saved": len(saved_evidence)
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid evidence type: {ve}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def list_reports(
    status: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None)
):
    try:
        query = {}

        if status:
            clean_status = status.strip().lower()
            if clean_status not in [s.value for s in ReportStatus]:
                raise HTTPException(status_code=400, detail="Invalid status filter.")
            query["status"] = clean_status

        if country:
            query["incident_details.location.country"] = country.strip()

        if city:
            query["incident_details.location.city"] = city.strip()

        if from_date or to_date:
            query["incident_details.date"] = {}
            if from_date:
                query["incident_details.date"]["$gte"] = from_date
            if to_date:
                query["incident_details.date"]["$lte"] = to_date

        results = list(incident_reports.find(query))
        for doc in results:
            doc["_id"] = str(doc["_id"])

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{report_id}")
async def update_report_status(
    report_id: str,
    new_status: ReportStatus = Form(...)
):
    try:
        clean_report_id = report_id.strip()
        clean_status = new_status.value.strip()

        result = incident_reports.update_one(
            {"report_id": clean_report_id},
            {"$set": {"status": clean_status}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found.")

        return {
            "message": f"Status updated to '{clean_status}'",
            "report_id": clean_report_id
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status value.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
async def report_analytics():
    try:
        pipeline = [
            {"$unwind": "$violation_types"},
            {"$group": {
                "_id": "$violation_types",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}}
        ]

        results = list(incident_reports.aggregate(pipeline))

        # Format nicely
        analytics = [{"violation_type": r["_id"], "count": r["count"]} for r in results]

        return {
            "total_violation_types": len(analytics),
            "analytics": analytics
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))