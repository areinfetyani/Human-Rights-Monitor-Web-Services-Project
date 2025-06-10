from typing import Literal
from pydantic import BaseModel

class User(BaseModel):
    username: str
    role: Literal["admin", "case_manager", "analyst", "viewer"]