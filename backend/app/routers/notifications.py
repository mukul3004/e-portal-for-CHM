from typing import Optional, List
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case
from backend.app.models.schedule import CMHSession, SessionStatus
from backend.app.models.notification import Notification, NotificationChannel, NotificationType
from backend.app.schemas.notification import NotificationResponse, NotificationCreate

router = APIRouter(prefix="/notifications", tags=["Multi-Channel Hearing Notifications"])

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    recipient_email: Optional[str] = Query(None),
    recipient_role: Optional[str] = Query(None),
    unread_only: bool = Query(False),
    limit: int = Query(50),
    db: Session = Depends(get_db)
):
    """
    Fetches notifications with optional filtering by user email, role, or unread status.
    """
    query = db.query(Notification)
    if recipient_email:
        query = query.filter((Notification.recipient_email == recipient_email) | (Notification.recipient_email == "ALL"))
    elif recipient_role:
        query = query.filter((Notification.recipient_role == recipient_role) | (Notification.recipient_role == "ALL"))

    if unread_only:
        query = query.filter(Notification.is_read == False)

    return query.order_by(Notification.created_at.desc()).limit(limit).all()

@router.get("/summary")
def get_notifications_summary(
    recipient_email: Optional[str] = Query(None),
    recipient_role: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Returns total unread count and channel dispatch statistics."""
    query = db.query(Notification)
    if recipient_email:
        query = query.filter((Notification.recipient_email == recipient_email) | (Notification.recipient_email == "ALL"))
    elif recipient_role:
        query = query.filter((Notification.recipient_role == recipient_role) | (Notification.recipient_role == "ALL"))

    unread_count = query.filter(Notification.is_read == False).count()
    total_count = query.count()
    sms_count = db.query(Notification).filter(Notification.channel == NotificationChannel.SMS).count()
    wa_count = db.query(Notification).filter(Notification.channel == NotificationChannel.WHATSAPP).count()
    in_app_count = db.query(Notification).filter(Notification.channel == NotificationChannel.IN_APP).count()

    return {
        "unread_count": unread_count,
        "total_count": total_count,
        "channel_breakdown": {
            "in_app": in_app_count,
            "sms": sms_count,
            "whatsapp": wa_count
        }
    }

@router.post("/dispatch-hearing-alerts")
def dispatch_hearing_alerts(
    target_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    [Automated Multi-Channel Hearing Notice Engine]
    Automatically scans today's scheduled CMH sessions and dispatches statutory
    hearing notifications to Judges, Advocates, and Litigants across:
    1. In-App Notification Bell & Live Ticker
    2. Simulated SMS Gateway (Order V Rule 9 CPC notice compliance)
    3. Official WhatsApp Business Hearing Link Gateway
    """
    query = db.query(CMHSession)
    if target_date:
        query = query.filter(CMHSession.hearing_date == target_date)
    else:
        # Default to all upcoming/scheduled sessions
        query = query.filter(CMHSession.status == SessionStatus.SCHEDULED)

    sessions = query.all()
    if not sessions:
        # Fallback to any scheduled sessions in the database
        sessions = db.query(CMHSession).limit(10).all()

    created_notifications = []
    
    for s in sessions:
        case = db.query(Case).filter(Case.id == s.case_id).first()
        judge = db.query(User).filter(User.id == s.judge_id).first()
        p_counsel = db.query(User).filter(User.id == case.plaintiff_counsel_id).first() if case and case.plaintiff_counsel_id else None
        d_counsel = db.query(User).filter(User.id == case.defendant_counsel_id).first() if case and case.defendant_counsel_id else None

        hearing_time_str = f"{s.start_time.strftime('%H:%M')} - {s.end_time.strftime('%H:%M')}"
        date_str = s.hearing_date.isoformat()
        court_hall = s.court_hall_id or "HALL_04"
        cnr = case.cnr_number if case else "MPHC01-CMH-2026"
        case_title = case.case_title if case else "Commercial Matter"

        # 1. Alert for Hon'ble Judge
        judge_notif = Notification(
            recipient_email=judge.email if judge else "judge.sharma@svvv-courts.gov.in",
            recipient_name=judge.full_name if judge else "Hon'ble Presiding Judge",
            recipient_role="JUDGE",
            case_id=case.id if case else None,
            cnr_number=cnr,
            title=f"Hearing Scheduled: {cnr}",
            message=f"Order XV-A CPC Hearing listed on {date_str} at {hearing_time_str} in {court_hall}. Case: {case_title}",
            notification_type=NotificationType.HEARING_TODAY,
            channel=NotificationChannel.IN_APP,
            court_hall_id=court_hall,
            hearing_time=hearing_time_str,
            webrtc_room_id=s.webrtc_room_id
        )
        created_notifications.append(judge_notif)

        # 2. Alert for Plaintiff Counsel (In-App + WhatsApp)
        if p_counsel:
            p_inapp = Notification(
                recipient_email=p_counsel.email,
                recipient_name=p_counsel.full_name,
                recipient_role="ADVOCATE",
                case_id=case.id if case else None,
                cnr_number=cnr,
                title=f"CMH Hearing Notice: {cnr}",
                message=f"Your matter {case_title} is listed for Case Management Hearing today at {hearing_time_str} ({court_hall}). Be present with Admissions Checklist.",
                notification_type=NotificationType.HEARING_TODAY,
                channel=NotificationChannel.IN_APP,
                court_hall_id=court_hall,
                hearing_time=hearing_time_str,
                webrtc_room_id=s.webrtc_room_id
            )
            p_wa = Notification(
                recipient_email=p_counsel.email,
                recipient_name=p_counsel.full_name,
                recipient_role="ADVOCATE",
                case_id=case.id if case else None,
                cnr_number=cnr,
                title=f"[WhatsApp Alert] MPHC Hearing Today: {cnr}",
                message=f"MP High Court Notice: {case_title} scheduled at {hearing_time_str}. Virtual Hearing Room: {s.webrtc_room_id or 'ROOM-LIVE'}",
                notification_type=NotificationType.HEARING_TODAY,
                channel=NotificationChannel.WHATSAPP,
                court_hall_id=court_hall,
                hearing_time=hearing_time_str,
                webrtc_room_id=s.webrtc_room_id
            )
            created_notifications.extend([p_inapp, p_wa])

        # 3. Alert for Defendant Counsel (In-App + WhatsApp)
        if d_counsel:
            d_inapp = Notification(
                recipient_email=d_counsel.email,
                recipient_name=d_counsel.full_name,
                recipient_role="ADVOCATE",
                case_id=case.id if case else None,
                cnr_number=cnr,
                title=f"CMH Hearing Notice: {cnr}",
                message=f"Your matter {case_title} is listed for Case Management Hearing today at {hearing_time_str} ({court_hall}). Prepare statement on Statement of Truth.",
                notification_type=NotificationType.HEARING_TODAY,
                channel=NotificationChannel.IN_APP,
                court_hall_id=court_hall,
                hearing_time=hearing_time_str,
                webrtc_room_id=s.webrtc_room_id
            )
            d_wa = Notification(
                recipient_email=d_counsel.email,
                recipient_name=d_counsel.full_name,
                recipient_role="ADVOCATE",
                case_id=case.id if case else None,
                cnr_number=cnr,
                title=f"[WhatsApp Alert] MPHC Hearing Today: {cnr}",
                message=f"MP High Court Notice: {case_title} scheduled at {hearing_time_str}. Virtual Hearing Room: {s.webrtc_room_id or 'ROOM-LIVE'}",
                notification_type=NotificationType.HEARING_TODAY,
                channel=NotificationChannel.WHATSAPP,
                court_hall_id=court_hall,
                hearing_time=hearing_time_str,
                webrtc_room_id=s.webrtc_room_id
            )
            created_notifications.extend([d_inapp, d_wa])

        # 4. Alert for Litigant / Client (SMS Notice)
        p_name = "Plaintiff Litigant"
        d_name = "Defendant Litigant"
        if case and case.case_title:
            if " vs. " in case.case_title:
                parts = case.case_title.split(" vs. ")
                p_name, d_name = parts[0].strip(), parts[1].strip()
            elif " v. " in case.case_title:
                parts = case.case_title.split(" v. ")
                p_name, d_name = parts[0].strip(), parts[1].strip()
            else:
                p_name = case.case_title
        
        sms_litigant_p = Notification(
            recipient_email=f"litigant.{p_name.split()[0].lower()}@nic.in",
            recipient_name=p_name,
            recipient_role="LITIGANT",
            case_id=case.id if case else None,
            cnr_number=cnr,
            title=f"[SMS] MP High Court Daily Cause Notice",
            message=f"Your case {cnr} ({case_title}) is listed before {judge.full_name if judge else 'Commercial Court'} today at {hearing_time_str} in {court_hall}. Track status on e-Courts portal.",
            notification_type=NotificationType.HEARING_TODAY,
            channel=NotificationChannel.SMS,
            court_hall_id=court_hall,
            hearing_time=hearing_time_str,
            webrtc_room_id=s.webrtc_room_id
        )
        sms_litigant_d = Notification(
            recipient_email=f"litigant.{d_name.split()[0].lower()}@nic.in",
            recipient_name=d_name,
            recipient_role="LITIGANT",
            case_id=case.id if case else None,
            cnr_number=cnr,
            title=f"[SMS] MP High Court Daily Cause Notice",
            message=f"Your case {cnr} ({case_title}) is listed before {judge.full_name if judge else 'Commercial Court'} today at {hearing_time_str} in {court_hall}. Track status on e-Courts portal.",
            notification_type=NotificationType.HEARING_TODAY,
            channel=NotificationChannel.SMS,
            court_hall_id=court_hall,
            hearing_time=hearing_time_str,
            webrtc_room_id=s.webrtc_room_id
        )
        created_notifications.extend([sms_litigant_p, sms_litigant_d])

    db.add_all(created_notifications)
    db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Successfully generated and dispatched {len(created_notifications)} multi-channel hearing schedule notifications.",
        "dispatched_count": len(created_notifications),
        "sessions_processed": len(sessions),
        "channels": {
            "in_app": len([n for n in created_notifications if n.channel == NotificationChannel.IN_APP]),
            "whatsapp": len([n for n in created_notifications if n.channel == NotificationChannel.WHATSAPP]),
            "sms": len([n for n in created_notifications if n.channel == NotificationChannel.SMS])
        }
    }

@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """Mark an individual notification as read."""
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read", "id": notification_id}

@router.post("/mark-all-read")
def mark_all_read(
    recipient_email: Optional[str] = None,
    recipient_role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Mark all notifications as read for current user/role."""
    query = db.query(Notification).filter(Notification.is_read == False)
    if recipient_email:
        query = query.filter((Notification.recipient_email == recipient_email) | (Notification.recipient_email == "ALL"))
    elif recipient_role:
        query = query.filter((Notification.recipient_role == recipient_role) | (Notification.recipient_role == "ALL"))

    count = query.update({Notification.is_read: True}, synchronize_session=False)
    db.commit()
    return {"message": f"Marked {count} notifications as read.", "count": count}
