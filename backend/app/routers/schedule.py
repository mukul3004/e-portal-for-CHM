from typing import Optional, List
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseStatus
from backend.app.models.schedule import CMHSession, CourtRoom, SessionStatus
from backend.app.schemas.schedule import (
    SlotClashCheckRequest,
    ClashCheckResponse,
    BookSlotRequest,
    CMHSessionResponse,
    RecommendSlotRequest
)
from backend.app.services.clash_detector import ClashDetectionEngine
from backend.app.security.jwt_auth import get_current_user
from backend.app.security.rbac import require_roles

router = APIRouter(prefix="/schedule", tags=["Smart Hearing Scheduling"])


def evaluate_session_joinability(session: CMHSession, ref_datetime: Optional[datetime] = None) -> dict:
    """
    [Order XV-A Rule 1 CPC Virtual Courtroom Admittance Protocol]
    Universal admittance gate: enforces strictly across ALL participants (Judges, Advocates,
    Litigants, and Observers) that virtual meetings may only be joined at their scheduled time.
    Admittance window opens 15 minutes before scheduled start time and extends up to 30 minutes
    after scheduled end time (or continuously while actively marked IN_PROGRESS).
    """
    if ref_datetime is None:
        ref_datetime = datetime.now()
    today = ref_datetime.date()

    # 1. Concluded proceedings cannot be rejoined
    if session.status == SessionStatus.CONCLUDED:
        return {
            "is_joinable": False,
            "join_status": "CONCLUDED",
            "join_label": "Hearing Concluded",
            "join_message": "This hearing has already concluded under Order XV-A Rule 6 CPC. The virtual courtroom is closed."
        }

    # 2. Adjourned proceedings
    if session.status == SessionStatus.ADJOURNED:
        return {
            "is_joinable": False,
            "join_status": "ADJOURNED",
            "join_label": "Hearing Adjourned",
            "join_message": "This matter has been adjourned by the Hon'ble Court. Virtual courtroom access is inactive."
        }

    # 3. Actively in progress (Judge has convened court)
    if session.status == SessionStatus.IN_PROGRESS:
        return {
            "is_joinable": True,
            "join_status": "IN_PROGRESS",
            "join_label": "In Session • Live Now",
            "join_message": "Court is actively in session. You may enter the virtual courtroom."
        }

    # 4. Scheduled Session - Date Check
    h_date = session.hearing_date
    if h_date > today:
        diff_days = (h_date - today).days
        day_str = "Tomorrow" if diff_days == 1 else f"in {diff_days} days ({h_date.strftime('%d %b %Y')})"
        return {
            "is_joinable": False,
            "join_status": "UPCOMING",
            "join_label": f"Locked • {h_date.strftime('%d %b')} {session.start_time.strftime('%H:%M')}",
            "join_message": f"Virtual courtroom is locked. Scheduled for {day_str} at {session.start_time.strftime('%H:%M')}. Participants may only join at the scheduled time."
        }
    elif h_date < today:
        return {
            "is_joinable": False,
            "join_status": "EXPIRED",
            "join_label": "Date Passed",
            "join_message": f"The scheduled hearing date ({h_date.strftime('%d %b %Y')}) has passed. Virtual courtroom access is closed."
        }

    # 5. Scheduled Session Today - Time Window Check
    start_dt = datetime.combine(today, session.start_time)
    end_dt = datetime.combine(today, session.end_time)
    early_admittance = start_dt - timedelta(minutes=15)
    grace_end = end_dt + timedelta(minutes=30)

    if ref_datetime < early_admittance:
        mins_remaining = max(1, int((early_admittance - ref_datetime).total_seconds() / 60))
        return {
            "is_joinable": False,
            "join_status": "TOO_EARLY",
            "join_label": f"Opens {early_admittance.strftime('%H:%M')}",
            "join_message": f"Virtual courtroom opens 15 minutes prior to scheduled start. Scheduled for {session.start_time.strftime('%H:%M')} (opens in {mins_remaining} min). Early admittance is restricted."
        }
    elif ref_datetime > grace_end:
        return {
            "is_joinable": False,
            "join_status": "SLOT_PASSED",
            "join_label": "Slot Ended",
            "join_message": f"The scheduled time slot ({session.start_time.strftime('%H:%M')} - {session.end_time.strftime('%H:%M')}) has ended. Virtual courtroom access is closed."
        }
    else:
        return {
            "is_joinable": True,
            "join_status": "LIVE_NOW",
            "join_label": "Join Virtual Hearing",
            "join_message": "Scheduled hearing window is active. You may join the virtual hearing."
        }


@router.post("/check-clash", response_model=ClashCheckResponse)
def check_advocate_clash(
    payload: SlotClashCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    [CMH-205] Validates advocate availability across all courtrooms for proposed slot.
    Flags instant red collision alerts if any advocate is double-booked.
    """
    has_conflict, msg, counsel_bar_id, hall = ClashDetectionEngine.check_conflict(
        db=db,
        advocate_bar_ids=payload.advocate_bar_ids,
        hearing_date=payload.hearing_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        court_hall_id=payload.court_hall_id
    )

    return ClashCheckResponse(
        has_conflict=has_conflict,
        conflict_message=msg,
        conflicting_counsel_bar_id=counsel_bar_id,
        conflicting_court_hall=hall
    )

@router.post("/book", response_model=CMHSessionResponse, status_code=status.HTTP_201_CREATED)
def book_cmh_slot(
    payload: BookSlotRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleType.CLERK, RoleType.JUDGE))
):
    """[CMH-206] Allocate conflict-free pre-trial CMH slot and generate WebRTC room."""
    case = db.query(Case).filter(Case.id == payload.case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    # Ensure court room exists in db or seed default
    room = db.query(CourtRoom).filter(CourtRoom.hall_id == payload.court_hall_id).first()
    if not room:
        room = CourtRoom(hall_id=payload.court_hall_id, hall_name=f"Courtroom {payload.court_hall_id}")
        db.add(room)
        db.flush()

    # Collect advocate bar IDs
    bar_ids = []
    if case.plaintiff_counsel_id:
        p_counsel = db.query(User).filter(User.id == case.plaintiff_counsel_id).first()
        if p_counsel and p_counsel.bar_council_id:
            bar_ids.append(p_counsel.bar_council_id)
    if case.defendant_counsel_id:
        d_counsel = db.query(User).filter(User.id == case.defendant_counsel_id).first()
        if d_counsel and d_counsel.bar_council_id:
            bar_ids.append(d_counsel.bar_council_id)

    # Check for clash
    has_clash, clash_msg, _, _ = ClashDetectionEngine.check_conflict(
        db=db,
        advocate_bar_ids=bar_ids,
        hearing_date=payload.hearing_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        court_hall_id=payload.court_hall_id
    )
    if has_clash:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=clash_msg)

    # Create session
    session = CMHSession(
        case_id=case.id,
        judge_id=case.judge_id or current_user.id,
        court_hall_id=payload.court_hall_id,
        hearing_date=payload.hearing_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status=SessionStatus.SCHEDULED
    )
    case.status = CaseStatus.CMH_SCHEDULED
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/cause-list")
def get_daily_cause_list(
    hearing_date: Optional[str] = None,
    court_hall_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    [Cause List / रोज़नामचा]
    Fetches the High Court Daily Cause Board.
    If hearing_date is not specified, returns the closest upcoming scheduled sessions.
    """
    query = db.query(CMHSession)
    if hearing_date:
        query = query.filter(CMHSession.hearing_date == hearing_date)
    else:
        # Default to upcoming active hearings from current date
        today_val = date.today()
        query = query.filter(CMHSession.hearing_date >= today_val)
    if court_hall_id and court_hall_id != "ALL":
        query = query.filter(CMHSession.court_hall_id == court_hall_id)

    sessions = query.order_by(CMHSession.hearing_date.asc(), CMHSession.start_time.asc()).all()

    # If no sessions found from today onwards, fetch all scheduled sessions
    if not sessions:
        sessions = db.query(CMHSession).order_by(CMHSession.hearing_date.desc(), CMHSession.start_time.asc()).limit(50).all()

    items = []
    for idx, s in enumerate(sessions, 1):
        case = db.query(Case).filter(Case.id == s.case_id).first()
        judge = db.query(User).filter(User.id == s.judge_id).first()
        p_counsel = db.query(User).filter(User.id == case.plaintiff_counsel_id).first() if case and case.plaintiff_counsel_id else None
        d_counsel = db.query(User).filter(User.id == case.defendant_counsel_id).first() if case and case.defendant_counsel_id else None

        items.append({
            "item_number": idx,
            "session_id": s.id,
            "hearing_date": s.hearing_date.isoformat(),
            "start_time": s.start_time.strftime("%H:%M"),
            "end_time": s.end_time.strftime("%H:%M"),
            "court_hall_id": s.court_hall_id,
            "status": s.status.value if hasattr(s.status, 'value') else str(s.status),
            "webrtc_room_id": s.webrtc_room_id,
            "is_joinable": evaluate_session_joinability(s)["is_joinable"],
            "join_status": evaluate_session_joinability(s)["join_status"],
            "join_label": evaluate_session_joinability(s)["join_label"],
            "join_message": evaluate_session_joinability(s)["join_message"],
            "case": {
                "id": case.id if case else "",
                "cnr_number": case.cnr_number if case else "",
                "case_title": case.case_title if case else "Unassigned",
                "case_type": case.case_type.value if case and hasattr(case.case_type, 'value') else (str(case.case_type) if case else ""),
                "claim_valuation": case.claim_valuation if case else 0.0,
            } if case else None,
            "judge_name": judge.full_name if judge else "Hon'ble Presiding Judge",
            "plaintiff_counsel": {
                "name": p_counsel.full_name if p_counsel else "Advocate for Plaintiff",
                "bar_council_id": p_counsel.bar_council_id if p_counsel else "N/A"
            },
            "defendant_counsel": {
                "name": d_counsel.full_name if d_counsel else "Advocate for Defendant",
                "bar_council_id": d_counsel.bar_council_id if d_counsel else "N/A"
            }
        })

    return {
        "total_items": len(items),
        "hearing_date": hearing_date or (items[0]["hearing_date"] if items else None),
        "items": items
    }

@router.get("/sessions/{session_id}/verify-join")
def verify_session_join(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    [Order XV-A Rule 1 CPC Virtual Courtroom Admittance Gate]
    Validates whether the session is joinable right now according to authoritative court time.
    Universal admittance enforcement for Judges, Advocates, and Litigants alike.
    """
    session = db.query(CMHSession).filter(CMHSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Hearing session not found.")

    eval_res = evaluate_session_joinability(session)
    return {
        "session_id": session.id,
        "hearing_date": session.hearing_date.isoformat(),
        "start_time": session.start_time.strftime("%H:%M"),
        "end_time": session.end_time.strftime("%H:%M"),
        "court_hall_id": session.court_hall_id,
        "status": session.status.value if hasattr(session.status, 'value') else str(session.status),
        **eval_res
    }

@router.patch("/sessions/{session_id}/status")
def update_session_status(
    session_id: str,
    status_update: dict,
    db: Session = Depends(get_db)
):
    """Updates session status (e.g. IN_PROGRESS, CONCLUDED, ADJOURNED, REFERRED_ADR)."""
    session = db.query(CMHSession).filter(CMHSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    new_st = status_update.get("status")
    if not new_st:
        raise HTTPException(status_code=400, detail="Status is required.")

    session.status = SessionStatus(new_st)
    db.commit()
    db.refresh(session)
    return {"message": "Session status updated successfully", "session_id": session.id, "status": session.status}

@router.get("/strategies")
def list_scheduling_strategies():
    """[GoF Strategy Pattern] Enumerates active runtime scheduling policies."""
    return [
        {
            "id": "strict",
            "name": "Strict Bench Slotting Strategy",
            "description": "Zero-tolerance non-overlap policy for physical courtroom benches and advocate appearances."
        },
        {
            "id": "buffered",
            "name": "Flexible Buffer Slotting Strategy",
            "description": "Applies a 15-minute inter-hall transit buffer to prevent back-to-back advocate exhaustion."
        },
        {
            "id": "virtual",
            "name": "Virtual Hybrid Slotting Strategy",
            "description": "E-Courts VC Link mode: courtroom physical hall collision waived, counsel personal clash enforced."
        }
    ]

@router.post("/recommend-slot")
def recommend_hearing_slot(
    payload: RecommendSlotRequest,
    db: Session = Depends(get_db)
):
    """[GoF Strategy Pattern] Recommends conflict-free hearing slot using active policy."""
    slot = ClashDetectionEngine.recommend_slot(
        db=db,
        advocate_bar_ids=payload.advocate_bar_ids or [],
        hearing_date=payload.hearing_date,
        duration_minutes=payload.duration_minutes,
        court_hall_id=payload.court_hall_id,
        strategy_name=payload.strategy
    )
    if not slot:
        raise HTTPException(status_code=404, detail="No conflict-free slot found on the selected date.")
    return slot


