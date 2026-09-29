import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum
from backend.app.database import Base

class RoleType(str, enum.Enum):
    JUDGE = "ROLE_JUDGE"
    ADVOCATE = "ROLE_ADVOCATE"
    CLERK = "ROLE_CLERK"
    LITIGANT = "ROLE_LITIGANT"
    ADMIN = "ROLE_ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    role = Column(Enum(RoleType), nullable=False, default=RoleType.ADVOCATE)
    
    # Role-specific fields
    bar_council_id = Column(String(100), nullable=True, index=True)   # For Advocates
    bench_id = Column(String(100), nullable=True)                     # For Judges
    court_hall_id = Column(String(50), nullable=True)                 # Assigned Court Hall
    aadhaar_hash = Column(String(64), nullable=True)                  # For Litigants
    
    is_active = Column(Boolean, default=True)
    is_2fa_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
