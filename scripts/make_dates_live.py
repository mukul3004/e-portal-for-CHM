import os
import sys
import uuid
from datetime import datetime, date, time, timedelta

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.database import SessionLocal
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case, CaseStatus, Pleading, Exhibit
from backend.app.models.admissions import AdmissionsChecklist
from backend.app.models.schedule import CMHSession, SessionStatus
from backend.app.models.order import CaseManagementOrder, DiscoveryDeadline, DeadlineStatus

TODAY = date(2026, 10, 26)

# Next week business days (+2 to +11 days)
NEXT_WEEK_DATES = [
    date(2026, 10, 28), # Wed
    date(2026, 10, 29), # Thu
    date(2026, 10, 30), # Fri
    date(2026, 11, 2),  # Mon
    date(2026, 11, 3),  # Tue
    date(2026, 11, 4),  # Wed
    date(2026, 11, 5),  # Thu
    date(2026, 11, 6),  # Fri
]

# Next month business days (+14 to +50 days)
NEXT_MONTH_DATES = [
    date(2026, 11, 9),  # Mon
    date(2026, 11, 10), # Tue
    date(2026, 11, 11), # Wed
    date(2026, 11, 12), # Thu
    date(2026, 11, 16), # Mon
    date(2026, 11, 17), # Tue
    date(2026, 11, 18), # Wed
    date(2026, 11, 19), # Thu
    date(2026, 11, 24), # Tue
    date(2026, 11, 25), # Wed
    date(2026, 11, 26), # Thu
    date(2026, 12, 1),  # Tue
    date(2026, 12, 2),  # Wed
    date(2026, 12, 3),  # Thu
    date(2026, 12, 8),  # Tue
    date(2026, 12, 10), # Thu
    date(2026, 12, 15), # Tue
]

TIME_SLOTS = [
    (time(10, 30), time(11, 15)),
    (time(11, 30), time(12, 15)),
    (time(14, 0),  time(14, 45)),
    (time(15, 0),  time(15, 45)),
    (time(16, 0),  time(16, 45)),
]

def make_dates_live():
    db = SessionLocal()
    try:
        cases = db.query(Case).all()
        print(f"Total cases in DB: {len(cases)}")

        judge = db.query(User).filter(User.role == RoleType.JUDGE).first()

        cmh_sched_idx = 0
        pre_cmh_idx = 0
        filed_idx = 0
        cmo_idx = 0
        disposed_idx = 0

        for c in cases:
            # 1. Update CNR suffix to 2026
            old_cnr = c.cnr_number
            if len(old_cnr) >= 16:
                prefix = old_cnr[:12]
                new_cnr = f"{prefix}2026"
            else:
                new_cnr = old_cnr
            c.cnr_number = new_cnr

            # 2. Update filing date & session based on status
            if c.status == CaseStatus.CMH_SCHEDULED:
                # Half in next week, half in next month
                if cmh_sched_idx % 2 == 0:
                    hearing_date = NEXT_WEEK_DATES[(cmh_sched_idx // 2) % len(NEXT_WEEK_DATES)]
                else:
                    hearing_date = NEXT_MONTH_DATES[(cmh_sched_idx // 2) % len(NEXT_MONTH_DATES)]
                
                # Filing date 25-45 days before hearing
                filing_days_ago = 20 + (cmh_sched_idx % 15)
                c.filing_date = datetime.combine(TODAY - timedelta(days=filing_days_ago), time(10, 0))

                # Update or create scheduled session
                session = db.query(CMHSession).filter(CMHSession.case_id == c.id).first()
                slot = TIME_SLOTS[cmh_sched_idx % len(TIME_SLOTS)]
                if session:
                    session.hearing_date = hearing_date
                    session.start_time = slot[0]
                    session.end_time = slot[1]
                    session.status = SessionStatus.SCHEDULED
                    session.webrtc_room_id = f"webrtc-cmh-{new_cnr.lower()}"
                else:
                    session = CMHSession(
                        id=str(uuid.uuid4()),
                        case_id=c.id,
                        judge_id=judge.id if judge else c.judge_id,
                        court_hall_id=c.court_hall_id or "HALL_04",
                        hearing_date=hearing_date,
                        start_time=slot[0],
                        end_time=slot[1],
                        status=SessionStatus.SCHEDULED,
                        webrtc_room_id=f"webrtc-cmh-{new_cnr.lower()}"
                    )
                    db.add(session)
                cmh_sched_idx += 1

            elif c.status == CaseStatus.PRE_CMH:
                # Next week or in 2 weeks
                hearing_date = NEXT_WEEK_DATES[pre_cmh_idx % len(NEXT_WEEK_DATES)]
                filing_days_ago = 10 + (pre_cmh_idx % 10)
                c.filing_date = datetime.combine(TODAY - timedelta(days=filing_days_ago), time(10, 0))

                session = db.query(CMHSession).filter(CMHSession.case_id == c.id).first()
                slot = TIME_SLOTS[(pre_cmh_idx + 1) % len(TIME_SLOTS)]
                if session:
                    session.hearing_date = hearing_date
                    session.start_time = slot[0]
                    session.end_time = slot[1]
                    session.status = SessionStatus.SCHEDULED
                    session.webrtc_room_id = f"webrtc-cmh-{new_cnr.lower()}"
                else:
                    session = CMHSession(
                        id=str(uuid.uuid4()),
                        case_id=c.id,
                        judge_id=judge.id if judge else c.judge_id,
                        court_hall_id=c.court_hall_id or "HALL_04",
                        hearing_date=hearing_date,
                        start_time=slot[0],
                        end_time=slot[1],
                        status=SessionStatus.SCHEDULED,
                        webrtc_room_id=f"webrtc-cmh-{new_cnr.lower()}"
                    )
                    db.add(session)
                pre_cmh_idx += 1

            elif c.status == CaseStatus.FILED:
                # Scheduled in next month
                hearing_date = NEXT_MONTH_DATES[filed_idx % len(NEXT_MONTH_DATES)]
                filing_days_ago = 2 + (filed_idx % 8)
                c.filing_date = datetime.combine(TODAY - timedelta(days=filing_days_ago), time(10, 0))

                session = db.query(CMHSession).filter(CMHSession.case_id == c.id).first()
                slot = TIME_SLOTS[(filed_idx + 2) % len(TIME_SLOTS)]
                if session:
                    session.hearing_date = hearing_date
                    session.start_time = slot[0]
                    session.end_time = slot[1]
                    session.status = SessionStatus.SCHEDULED
                    session.webrtc_room_id = f"webrtc-cmh-{new_cnr.lower()}"
                else:
                    session = CMHSession(
                        id=str(uuid.uuid4()),
                        case_id=c.id,
                        judge_id=judge.id if judge else c.judge_id,
                        court_hall_id=c.court_hall_id or "HALL_04",
                        hearing_date=hearing_date,
                        start_time=slot[0],
                        end_time=slot[1],
                        status=SessionStatus.SCHEDULED,
                        webrtc_room_id=f"webrtc-cmh-{new_cnr.lower()}"
                    )
                    db.add(session)
                filed_idx += 1

            elif c.status == CaseStatus.CMO_ISSUED:
                # CMH was conducted in Sep/Oct 2026; CMO issued recently
                cmo_date = TODAY - timedelta(days=4 + (cmo_idx % 14))
                cmh_past_date = cmo_date - timedelta(days=2)
                filing_past_date = cmh_past_date - timedelta(days=45)

                c.filing_date = datetime.combine(filing_past_date, time(10, 0))

                session = db.query(CMHSession).filter(CMHSession.case_id == c.id).first()
                if session:
                    session.hearing_date = cmh_past_date
                    session.status = SessionStatus.CONCLUDED
                    session.webrtc_room_id = f"webrtc-cmh-{new_cnr.lower()}"

                cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == c.id).first()
                if cmo:
                    cmo.order_date = datetime.combine(cmo_date, time(15, 0))
                    # Update discovery deadlines to upcoming (Next week / Next month)
                    deadlines = db.query(DiscoveryDeadline).filter(DiscoveryDeadline.order_id == cmo.id).all()
                    if len(deadlines) >= 1:
                        deadlines[0].due_date = NEXT_WEEK_DATES[cmo_idx % len(NEXT_WEEK_DATES)]
                        deadlines[0].status = DeadlineStatus.PENDING
                    if len(deadlines) >= 2:
                        deadlines[1].due_date = NEXT_MONTH_DATES[cmo_idx % len(NEXT_MONTH_DATES)]
                        deadlines[1].status = DeadlineStatus.PENDING
                cmo_idx += 1

            elif c.status == CaseStatus.DISPOSED:
                # Disposed cases: historic earlier in 2026
                disp_days_ago = 30 + (disposed_idx % 60)
                disp_date = TODAY - timedelta(days=disp_days_ago)
                cmh_date = disp_date - timedelta(days=15)
                filing_date = cmh_date - timedelta(days=50)

                c.filing_date = datetime.combine(filing_date, time(10, 0))

                session = db.query(CMHSession).filter(CMHSession.case_id == c.id).first()
                if session:
                    session.hearing_date = cmh_date
                    session.status = SessionStatus.CONCLUDED
                    session.webrtc_room_id = f"webrtc-cmh-{new_cnr.lower()}"

                cmo = db.query(CaseManagementOrder).filter(CaseManagementOrder.case_id == c.id).first()
                if cmo:
                    cmo.order_date = datetime.combine(disp_date - timedelta(days=10), time(15, 0))
                    deadlines = db.query(DiscoveryDeadline).filter(DiscoveryDeadline.order_id == cmo.id).all()
                    for d in deadlines:
                        d.status = DeadlineStatus.COMPLETED
                        d.due_date = disp_date - timedelta(days=2)
                disposed_idx += 1

            # Update pleadings dates to match filing_date
            pleadings = db.query(Pleading).filter(Pleading.case_id == c.id).all()
            for p in pleadings:
                p.submitted_at = c.filing_date + timedelta(hours=2)
                p.file_storage_url = f"/storage/pleadings/{new_cnr}_plaint.pdf"
                exhibits = db.query(Exhibit).filter(Exhibit.pleading_id == p.id).all()
                for ex in exhibits:
                    ex.uploaded_at = c.filing_date + timedelta(hours=2)
                    ex.file_storage_url = f"/storage/exhibits/{new_cnr}_P1.pdf"

            # Update checklist dates
            if c.checklist:
                c.checklist.plaintiff_submitted_at = c.filing_date + timedelta(days=2)
                if c.checklist.defendant_submitted_at:
                    c.checklist.defendant_submitted_at = c.filing_date + timedelta(days=15)
                c.checklist.updated_at = c.filing_date + timedelta(days=16)

        db.commit()
        print("✅ Successfully made all dates in cmh_portal.db LIVE!")
        print(f"Summary: {cmh_sched_idx} CMH_SCHEDULED, {pre_cmh_idx} PRE_CMH, {filed_idx} FILED, {cmo_idx} CMO_ISSUED, {disposed_idx} DISPOSED.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating dates: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    make_dates_live()
