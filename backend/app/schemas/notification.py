from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.models.notification import NotificationChannel, NotificationType

class NotificationBase(BaseModel):
    recipient_email: str
    recipient_name: str
    recipient_role: str
    case_id: Optional[str] = None
    cnr_number: Optional[str] = None
    title: str
    message: str
    notification_type: NotificationType = NotificationType.HEARING_TODAY
    channel: NotificationChannel = NotificationChannel.IN_APP
    court_hall_id: Optional[str] = "HALL_04"
    hearing_time: Optional[str] = None
    webrtc_room_id: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
