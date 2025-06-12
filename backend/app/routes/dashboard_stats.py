from fastapi import APIRouter, HTTPException
from app.database import db

router = APIRouter()

@router.get("/dashboard-stats")
def dashboard_stats():
    try:
        return {
            "total_cases": db.cases.count_documents({}),
            "archived_cases": db.Archive_cases.count_documents({}),
            "active_victims": db.victims.count_documents({}),  # remove filter here
            "reports_submitted": db.incident_reports.count_documents({})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
