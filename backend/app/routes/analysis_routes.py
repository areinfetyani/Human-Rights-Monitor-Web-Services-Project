from fastapi import APIRouter
from pymongo import MongoClient
from app.database import db
from typing import Dict

router = APIRouter()

@router.get("/ana")
def full_dashboard():
    dashboard = {}

    # --- CASE ANALYTICS ---
    dashboard["cases_by_violation"] = list(db.cases.aggregate([
        {"$unwind": "$violation_types"},
        {"$group": {"_id": "$violation_types", "count": {"$sum": 1}}},
        {"$project": {"violation_type": "$_id", "count": 1, "_id": 0}}
    ]))

    dashboard["cases_by_location"] = list(db.cases.aggregate([
        {"$group": {
            "_id": {
                "country": "$location.country",
                "region": "$location.region",
                "coords": "$location.coordinates"
            },
            "count": {"$sum": 1}
        }},
        {"$project": {
            "country": "$_id.country",
            "region": "$_id.region",
            "latitude": {"$arrayElemAt": ["$_id.coords.coordinates", 1]},
            "longitude": {"$arrayElemAt": ["$_id.coords.coordinates", 0]},
            "count": 1,
            "_id": 0
        }}
    ]))

    dashboard["cases_by_date"] = list(db.cases.aggregate([
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$date_reported"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}},
        {"$project": {"date": "_id", "count": 1, "_id": 0}}
    ]))

    dashboard["cases_by_country"] = list(db.cases.aggregate([
        {"$group": {"_id": "$location.country", "count": {"$sum": 1}}},
        {"$project": {"country": "$_id", "count": 1, "_id": 0}},
        {"$sort": {"count": -1}}
    ]))

    dashboard["cases_by_status"] = list(db.cases.aggregate([
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        {"$project": {"status": "$_id", "count": 1, "_id": 0}}
    ]))

    # --- VICTIM ANALYTICS ---
    dashboard["victims_by_gender"] = list(db.victims.aggregate([
        {"$match": {"demographics.gender": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": "$demographics.gender", "count": {"$sum": 1}}},
        {"$project": {"gender": "$_id", "count": 1, "_id": 0}}
    ]))

    age_stats = list(db.victims.aggregate([
        {"$match": {"demographics.age": {"$exists": True, "$ne": None}}},
        {"$group": {
            "_id": None,
            "avg_age": {"$avg": "$demographics.age"},
            "min_age": {"$min": "$demographics.age"},
            "max_age": {"$max": "$demographics.age"}
        }},
        {"$project": {"_id": 0}}
    ]))
    dashboard["victims_age_stats"] = age_stats[0] if age_stats else {}

    dashboard["victims_by_ethnicity"] = list(db.victims.aggregate([
        {"$match": {"demographics.ethnicity": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": "$demographics.ethnicity", "count": {"$sum": 1}}},
        {"$project": {"ethnicity": "$_id", "count": 1, "_id": 0}}
    ]))

    dashboard["victims_by_risk_level"] = list(db.victims.aggregate([
        {"$lookup": {
            "from": "victim_risk_assessments",
            "localField": "_id",
            "foreignField": "victim_id",
            "as": "risk"
        }},
        {"$unwind": "$risk"},
        {"$group": {"_id": "$risk.level", "count": {"$sum": 1}}},
        {"$project": {"risk_level": "$_id", "count": 1, "_id": 0}}
    ]))

    protection_needed = list(db.victims.aggregate([
        {"$lookup": {
            "from": "victim_risk_assessments",
            "localField": "_id",
            "foreignField": "victim_id",
            "as": "risk"
        }},
        {"$unwind": "$risk"},
        {"$match": {"risk.protection_needed": True}},
        {"$count": "count"}
    ]))
    dashboard["victims_protection_needed"] = protection_needed[0]["count"] if protection_needed else 0

    dashboard["victims_by_case_status"] = list(db.victims.aggregate([
        {"$unwind": "$cases_involved"},
        {"$lookup": {
            "from": "cases",
            "localField": "cases_involved",
            "foreignField": "case_id",
            "as": "case"
        }},
        {"$unwind": "$case"},
        {"$group": {"_id": "$case.status", "count": {"$sum": 1}}},
        {"$project": {"status": "$_id", "count": 1, "_id": 0}}
    ]))

    return dashboard