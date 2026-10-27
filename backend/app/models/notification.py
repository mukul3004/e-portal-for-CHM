import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey
from backend.app.database import Base

class NotificationChannel(str, enum.Enum):
    IN_APP = "IN_APP"
    SMS = "SMS"
    WHATSAPP = "WHATSAPP"
    EMAIL = "EMAIL"

class NotificationType(str, enum.Enum):
    HEARING_TODAY = "HEARING_TODAY"
    COURT_CALL = "COURT_CALL"
    SCHEDULE_UPDATE = "SCHEDULE_UPDATE"
    ADMISSIONS_FILED = "ADMISSIONS_FILED"
    CMO_SIGNED = "CMO_SIGNED"
    CHALLAN_PAID = "CHALLAN_PAID"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipient_email = Column(String(150), index=True, nullable=False)
    recipient_name = Column(String(150), nullable=False)
    recipient_role = Column(String(50), nullable=False)
    
    case_id = Column(String(36), ForeignKey("cases.id"), nullable=True)
    cnr_number = Column(String(50), nullable=True, index=True)
    
    title = Column(String(200), nullable=False)
    message = Column(String(500), nullable=False)
    notification_type = Column(Enum(NotificationType), default=NotificationType.HEARING_TODAY)
    channel = Column(Enum(NotificationChannel), default=NotificationChannel.IN_APP)
    
    court_hall_id = Column(String(50), default="HALL_04")
    hearing_time = Column(String(50), nullable=True)
    webrtc_room_id = Column(String(100), nullable=True)
    
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
