from datetime import date
from backend.app.services.court_calendar import CourtCalendarService


def test_calendar_service_day_status():
    # 1. Gazetted Holiday: Diwali
    diwali = date(2026, 11, 9)
    st = CourtCalendarService.get_day_status(diwali)
    assert not st["is_working_day"]
    assert st["is_holiday"]
    assert "Diwali" in st["label_en"] or "Deepawali" in st["label_en"]
    assert st["category"] == "GAZETTED_HOLIDAY"

    # 2. Sunday
    sun = date(2026, 11, 1)
    st_sun = CourtCalendarService.get_day_status(sun)
    assert not st_sun["is_working_day"]
    assert st_sun["status"] == "SUNDAY"

    # 3. Second Saturday
    sec_sat = date(2026, 11, 14)
    st_sec_sat = CourtCalendarService.get_day_status(sec_sat)
    assert not st_sec_sat["is_working_day"]
    assert st_sec_sat["status"] == "SECOND_SATURDAY"

    # 4. Fourth Saturday
    fourth_sat = date(2026, 11, 28)
    st_fourth_sat = CourtCalendarService.get_day_status(fourth_sat)
    assert not st_fourth_sat["is_working_day"]
    assert st_fourth_sat["status"] == "FOURTH_SATURDAY"

    # 5. Summer Vacation
    summer_vac = date(2026, 5, 20)
    st_vac = CourtCalendarService.get_day_status(summer_vac)
    assert not st_vac["is_working_day"]
    assert st_vac["is_vacation"]
    assert st_vac["status"] == "COURT_VACATION"

    # 6. Regular Court Working Day
    work_day = date(2026, 11, 3)  # Tuesday
    st_work = CourtCalendarService.get_day_status(work_day)
    assert st_work["is_working_day"]
    assert not st_work["is_holiday"]
    assert st_work["status"] == "COURT_WORKING_DAY"


def test_calendar_next_working_day():
    # Next working day after Diwali (9 Nov is Diwali, 10 is Govardhan, 11 is Bhai Dooj) -> 12 Nov (Thursday)
    diwali = date(2026, 11, 9)
    next_day = CourtCalendarService.get_next_working_day(diwali)
    assert next_day == date(2026, 11, 12)

    # Next working day after Second Saturday (14 Nov is 2nd Sat, 15 Nov is Sun) -> 16 Nov (Monday)
    sec_sat = date(2026, 11, 14)
    next_day_sec = CourtCalendarService.get_next_working_day(sec_sat)
    assert next_day_sec == date(2026, 11, 16)


def test_api_calendar_holidays_endpoint(client):
    resp = client.get("/api/v1/schedule/calendar/holidays?year=2026")
    assert resp.status_code == 200
    data = resp.json()
    assert data["year"] == 2026
    assert data["gazetted_holidays_count"] > 15
    assert len(data["vacations"]) >= 3
    assert data["working_days"] > 200


def test_api_calendar_month_overview_endpoint(client):
    resp = client.get("/api/v1/schedule/calendar/month-overview?year=2026&month=11")
    assert resp.status_code == 200
    data = resp.json()
    assert data["year"] == 2026
    assert data["month"] == 11
    assert data["total_days"] == 30
    assert len(data["days"]) == 30

    # Verify a day in the month
    day_9 = next(d for d in data["days"] if d["day_number"] == 9)
    assert not day_9["is_working_day"]
    assert "Diwali" in day_9["label_en"] or "Deepawali" in day_9["label_en"]


def test_api_calendar_check_date_endpoint(client):
    # Check holiday
    resp_hol = client.get("/api/v1/schedule/calendar/check-date?hearing_date=2026-11-09")
    assert resp_hol.status_code == 200
    data_hol = resp_hol.json()
    assert not data_hol["is_working_day"]
    assert data_hol["next_working_day"] == "2026-11-12"

    # Check working day
    resp_work = client.get("/api/v1/schedule/calendar/check-date?hearing_date=2026-11-03")
    assert resp_work.status_code == 200
    data_work = resp_work.json()
    assert data_work["is_working_day"]
    assert data_work["next_working_day"] is None
