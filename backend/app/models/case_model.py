from app.database import db
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

cases = db["cases"]
case_status_history=db["case_status_history"]
cases_archive=db["Archive_cases"]

class Coordinates(BaseModel):
  type: str ="Point"
  coordinates : List[float]

class Location(BaseModel):
  country : str
  region : str
  coordinates: Coordinates


class Perpetrators(BaseModel):
    name: str
    type: str

class Evidence(BaseModel):
  type: str
  url : str
  description: str
  date_captured: datetime

class Priority(str, Enum):
    HIGH = "high"
    LOW = "low"
    MODERATE = "moderate"


class CaseStatus(str, Enum):
    NEW = "new"
    UNDER_INVESTIGATION = "under_investigation"
    RESOLVED = "resolved"
    ARCHIVED = "archived"

class Case(BaseModel):
  _id: Optional[str] = None
  case_id: str
  title: str
  description: str
  violation_types: List[str]
  status: CaseStatus
  priority: Priority
  location: Location
  date_occurred: datetime
  date_reported : datetime
  victims: Optional[List[str]] = []
  perpetrators: List[Perpetrators]
  evidence: List[Evidence]
  created_by: str
  created_at: datetime
  updated_at :datetime

class CaseFilter(BaseModel):
    violation_types: Optional[List[str]] = None
    status: Optional[CaseStatus] = None
    priority: Optional[Priority] = None
    country: Optional[str] = None 
    region: Optional[str] = None
    date_occurred_from: Optional[datetime] = None
    date_occurred_to: Optional[datetime] = None
    date_reported: Optional[datetime] = None
    victims: Optional[List[str]] = None
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class statusChange(BaseModel):
   case_id: str
   old_status: CaseStatus
   new_status: CaseStatus
   updated_at: datetime
   updated_by: str

class CaseArchive(BaseModel):
  _id: Optional[str] = None
  case_id: str
  title: str
  description: str
  violation_types: List[str]
  status: CaseStatus
  priority: Priority
  location: Location
  date_occurred: datetime
  date_reported : datetime
  victims: Optional[List[str]] = []
  perpetrators: List[Perpetrators]
  evidence: List[Evidence]
  created_by: str
  created_at: datetime
  updated_at :datetime
  archived_at:datetime