
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Literal

class RiskAssessment(BaseModel):
    level: str = Field(..., pattern="^(low|medium|high)$")
    threats: List[str] = []
    protection_needed: bool = False


class SupportService(BaseModel):
    type: str 
    provider: Optional[str]
    status: str 


class ContactInfo(BaseModel):
    email: Optional[EmailStr]
    phone: Optional[str]
    secure_messaging: Optional[str]  


class Demographics(BaseModel):
    gender: Optional[str]
    age: Optional[int]
    ethnicity: Optional[str]
    occupation: Optional[str]


class VictimBase(BaseModel):
    name: Optional[str] = None
    type: Literal["victim"] = "victim"
    anonymous: bool = False
    demographics: Optional[Demographics]
    contact_info: Optional[ContactInfo]
    support_services: Optional[List[SupportService]]
    cases_involved: Optional[List[str]]


class VictimCreate(VictimBase):
    risk_assessment: Optional[RiskAssessment]  


class VictimUpdateRisk(RiskAssessment):
    pass


class VictimDB(VictimBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True