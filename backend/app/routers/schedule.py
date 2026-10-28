from typing import Optional, List
from datetime import date
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


