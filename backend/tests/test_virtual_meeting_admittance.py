import uuid
from datetime import date, time, datetime, timedelta
import pytest
from backend.app.models.schedule import CMHSession, SessionStatus
from backend.app.routers.schedule import evaluate_session_joinability

def test_evaluate_session_concluded():
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=date(2026, 10, 29),
        start_time=time(10, 30),
        end_time=time(11, 15),
        status=SessionStatus.CONCLUDED
    )
    result = evaluate_session_joinability(session)
    assert result["is_joinable"] is False
    assert result["join_status"] == "CONCLUDED"
    assert "concluded" in result["join_message"].lower()

def test_evaluate_session_in_progress():
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=date(2026, 10, 29),
        start_time=time(10, 30),
        end_time=time(11, 15),
        status=SessionStatus.IN_PROGRESS
    )
    result = evaluate_session_joinability(session)
    assert result["is_joinable"] is True
    assert result["join_status"] == "IN_PROGRESS"

def test_evaluate_session_upcoming_future_date():
    today = date(2026, 10, 29)
    future_date = date(2026, 11, 3)
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=future_date,
        start_time=time(11, 30),
        end_time=time(12, 15),
        status=SessionStatus.SCHEDULED
    )
    ref_time = datetime(2026, 10, 29, 11, 30)
    result = evaluate_session_joinability(session, ref_datetime=ref_time)
    assert result["is_joinable"] is False
    assert result["join_status"] == "UPCOMING"
    assert "locked" in result["join_message"].lower()

def test_evaluate_session_expired_past_date():
    past_date = date(2026, 10, 20)
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=past_date,
        start_time=time(10, 30),
        end_time=time(11, 15),
        status=SessionStatus.SCHEDULED
    )
    ref_time = datetime(2026, 10, 29, 10, 30)
    result = evaluate_session_joinability(session, ref_datetime=ref_time)
    assert result["is_joinable"] is False
    assert result["join_status"] == "EXPIRED"

def test_evaluate_session_today_too_early():
    today = date(2026, 10, 29)
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=today,
        start_time=time(15, 0),
        end_time=time(15, 45),
        status=SessionStatus.SCHEDULED
    )
    # Check at 14:00 (1 hour before start, outside the 15-min admittance window)
    ref_time = datetime(2026, 10, 29, 14, 0)
    result = evaluate_session_joinability(session, ref_datetime=ref_time)
    assert result["is_joinable"] is False
    assert result["join_status"] == "TOO_EARLY"
    assert "15 minutes" in result["join_message"]

def test_evaluate_session_today_active_window():
    today = date(2026, 10, 29)
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=today,
        start_time=time(15, 0),
        end_time=time(15, 45),
        status=SessionStatus.SCHEDULED
    )
    # Check at 14:50 (10 minutes before start, inside 15-min admittance window)
    ref_time_early = datetime(2026, 10, 29, 14, 50)
    res_early = evaluate_session_joinability(session, ref_datetime=ref_time_early)
    assert res_early["is_joinable"] is True
    assert res_early["join_status"] == "LIVE_NOW"

    # Check at 15:20 (during scheduled slot)
    ref_time_mid = datetime(2026, 10, 29, 15, 20)
    res_mid = evaluate_session_joinability(session, ref_datetime=ref_time_mid)
    assert res_mid["is_joinable"] is True
    assert res_mid["join_status"] == "LIVE_NOW"

    # Check at 15:55 (within 30-min post-slot buffer)
    ref_time_buffer = datetime(2026, 10, 29, 15, 55)
    res_buf = evaluate_session_joinability(session, ref_datetime=ref_time_buffer)
    assert res_buf["is_joinable"] is True
    assert res_buf["join_status"] == "LIVE_NOW"

def test_evaluate_session_today_slot_passed():
    today = date(2026, 10, 29)
    session = CMHSession(
        id=str(uuid.uuid4()),
        hearing_date=today,
        start_time=time(10, 30),
        end_time=time(11, 15),
        status=SessionStatus.SCHEDULED
    )
    # Check at 13:00 (more than 30 mins after 11:15 end time)
    ref_time = datetime(2026, 10, 29, 13, 0)
    result = evaluate_session_joinability(session, ref_datetime=ref_time)
    assert result["is_joinable"] is False
    assert result["join_status"] == "SLOT_PASSED"

def test_api_verify_join_not_found(client):
    resp = client.get("/api/v1/schedule/sessions/non-existent-id/verify-join")
    assert resp.status_code == 404

def test_api_cause_list_includes_joinability(client):
    resp = client.get("/api/v1/schedule/cause-list")
    assert resp.status_code == 200
    data = resp.json()
    if data.get("items"):
        item = data["items"][0]
        assert "is_joinable" in item
        assert "join_status" in item
        assert "join_label" in item
        assert "join_message" in item
        assert isinstance(item["is_joinable"], bool)
