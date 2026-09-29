from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from backend.app.models.user import RoleType

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    role: RoleType = RoleType.ADVOCATE
    bar_council_id: Optional[str] = None
    bench_id: Optional[str] = None
    court_hall_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: RoleType
    user_id: str
    full_name: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    phone_number: Optional[str] = None
    role: RoleType
    bar_council_id: Optional[str] = None
    bench_id: Optional[str] = None
    court_hall_id: Optional[str] = None
    is_active: bool
    created_at: datetime
