from app.database import db
from pydantic import BaseModel, EmailStr, conlist 
from typing import List, Optional
from datetime import datetime
from enum import Enum

report= db['reports']

incident_reports=db["incident_reports"]
report_evidence =db["report_evidence "]

class ReportStatus(str, Enum):
    NEW = "new"
    UNDER_INVESTIGATION = "under_investigation"
    RESOLVED = "resolved"

class ReporterType(str, Enum):
  VICTIM = "victim"
  WITNESS = "witness"
  JOURNALIST = "journalist"
  NGO = "ngo"

class PreferredContact(str, Enum):
    EMAIL = "email"
    PHONE = "phone"

class ContactInfo(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    preferred_contact: Optional[PreferredContact] = None

class Coordinates(BaseModel):
  type: str = "Point"
  coordinates: List[float]

class Location(BaseModel):
   country: str
   city: str
   coordinates: Coordinates

class IncidentDetails(BaseModel):
   date: datetime
   location: Location

class EvidenceType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    DOCUMENT = "application"


class Evidence(BaseModel):
  type: EvidenceType
  url : str
  description: str

class IncidentReport(BaseModel):
  _id: Optional[str] = None
  report_id: str
  reporter_type: ReporterType
  anonymous: bool = False
  contact_info: Optional[ContactInfo] = None
  incident_details: IncidentDetails
  violation_types: List[str]
  evidence: List[Evidence] = []
  status: ReportStatus
  assigned_to: str
  created_at: datetime