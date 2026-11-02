from datetime import date, timedelta
from typing import Optional, List, Dict, Any

# High Court of Madhya Pradesh Official Judicial Calendar (Authoritative Schedule)
# Applicable to Principal Seat Jabalpur, Indore Bench, and Gwalior Bench

GAZETTED_HOLIDAYS_2026: List[Dict[str, Any]] = [
    {
        "date": "2026-01-26",
        "name_en": "Republic Day",
        "name_hi": "गणतंत्र दिवस",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "National Holiday - 77th Republic Day of India"
    },
    {
        "date": "2026-02-15",
        "name_en": "Maha Shivratri",
        "name_hi": "महाशिवरात्रि",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Religious Holiday"
    },
    {
        "date": "2026-03-04",
        "name_en": "Holi / Dhulendi",
        "name_hi": "होली / धुलेंडी",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Festival of Colours"
    },
    {
        "date": "2026-03-08",
        "name_en": "Rangpanchami",
        "name_hi": "रंगपंचमी",
        "type": "BENCH_HOLIDAY",
        "benches": ["INDORE", "GWALIOR"],
        "description": "Regional Festival - High Court Indore Bench Special Local Holiday"
    },
    {
        "date": "2026-03-20",
        "name_en": "Id-ul-Fitr",
        "name_hi": "ईद-उल-फितर",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Islamic Holiday (subject to moon sighting)"
    },
    {
        "date": "2026-03-31",
        "name_en": "Mahavir Jayanti",
        "name_hi": "महावीर जयंती",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Birth Anniversary of Lord Mahavira"
    },
    {
        "date": "2026-04-03",
        "name_en": "Good Friday",
        "name_hi": "गुड फ्राइडे",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Christian Observance"
    },
    {
        "date": "2026-04-14",
        "name_en": "Dr. B.R. Ambedkar Jayanti",
        "name_hi": "डॉ. बी.आर. अम्बेडकर जयंती",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Birth Anniversary of Chief Architect of Constitution of India"
    },
    {
        "date": "2026-04-19",
        "name_en": "Bhagwan Parshuram Jayanti",
        "name_hi": "भगवान परशुराम जयंती",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Religious Holiday"
    },
    {
        "date": "2026-05-01",
        "name_en": "Buddha Purnima",
        "name_hi": "बुद्ध पूर्णिमा",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Birth of Gautama Buddha"
    },
    {
        "date": "2026-05-27",
        "name_en": "Id-ul-Zuha (Bakrid)",
        "name_hi": "ईद-उल-जुहा (बकरीद)",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Islamic Festival of Sacrifice"
    },
    {
        "date": "2026-06-26",
        "name_en": "Muharram",
        "name_hi": "मोहर्रम",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Islamic Observance"
    },
    {
        "date": "2026-08-15",
        "name_en": "Independence Day",
        "name_hi": "स्वतंत्रता दिवस",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "National Holiday - 80th Independence Day of India"
    },
    {
        "date": "2026-08-28",
        "name_en": "Raksha Bandhan",
        "name_hi": "रक्षाबंधन",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Festival of Sisterhood & Brotherhood"
    },
    {
        "date": "2026-09-04",
        "name_en": "Shri Krishna Janmashtami",
        "name_hi": "श्री कृष्ण जन्माष्टमी",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Birth of Lord Krishna"
    },
    {
        "date": "2026-09-25",
        "name_en": "Milad-un-Nabi (Eid-e-Milad)",
        "name_hi": "मिलाद-उन-नबी (ईद-ए-मिलाद)",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Prophet Muhammad's Birthday"
    },
    {
        "date": "2026-10-02",
        "name_en": "Mahatma Gandhi Jayanti",
        "name_hi": "महात्मा गांधी जयंती",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "National Holiday - Birth of Father of the Nation"
    },
    {
        "date": "2026-10-20",
        "name_en": "Dussehra (Vijayadashami)",
        "name_hi": "दशहरा (विजयादशमी)",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Victory of Good over Evil"
    },
    {
        "date": "2026-10-26",
        "name_en": "Maharishi Valmiki Jayanti",
        "name_hi": "महर्षि वाल्मीकि जयंती",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Birth Anniversary of Adi Kavi Valmiki"
    },
    {
        "date": "2026-11-08",
        "name_en": "Narak Chaturdashi / Chhoti Diwali",
        "name_hi": "नरक चतुर्दशी / छोटी दीपावली",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Diwali Festival Series Day 1"
    },
    {
        "date": "2026-11-09",
        "name_en": "Deepawali (Diwali)",
        "name_hi": "दीपावली",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Festival of Lights"
    },
    {
        "date": "2026-11-10",
        "name_en": "Govardhan Pooja",
        "name_hi": "गोवर्धन पूजा",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Annakoot & Govardhan Pooja"
    },
    {
        "date": "2026-11-11",
        "name_en": "Bhai Dooj",
        "name_hi": "भाई दूज",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Bhratri Dwitiya"
    },
    {
        "date": "2026-11-24",
        "name_en": "Guru Nanak Jayanti",
        "name_hi": "गुरु नानक जयंती",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Prakash Utsav of Guru Nanak Dev Ji"
    },
    {
        "date": "2026-12-25",
        "name_en": "Christmas",
        "name_hi": "क्रिसमस",
        "type": "GAZETTED_HOLIDAY",
        "benches": ["ALL"],
        "description": "Feast of the Nativity"
    }
]

COURT_VACATIONS_2026: List[Dict[str, Any]] = [
    {
        "name_en": "Summer Vacation",
        "name_hi": "ग्रीष्मकालीन अवकाश",
        "start_date": "2026-05-18",
        "end_date": "2026-06-12",
        "description": "Annual High Court Summer Vacation (Registry remains open for urgent filings; Vacation Bench sittings only)"
    },
    {
        "name_en": "Dussehra Vacation",
        "name_hi": "दशहरा अवकाश",
        "start_date": "2026-10-19",
        "end_date": "2026-10-24",
        "description": "High Court Dussehra Recess"
    },
    {
        "name_en": "Winter Vacation",
        "name_hi": "शीतकालीन अवकाश",
        "start_date": "2026-12-24",
        "end_date": "2026-12-31",
        "description": "Annual High Court Winter Recess"
    }
]


class CourtCalendarService:
    """
    Authoritative High Court Judicial Calendar Service.
    Enforces High Court of Madhya Pradesh working schedules, gazetted holidays,
    court vacations, and Section 10 General Clauses Act limitation extensions
    for Order XV-A CPC Case Management proceedings.
    """

    @staticmethod
    def is_second_saturday(d: date) -> bool:
        """Second Saturday of the month (Court Closed)."""
        return d.weekday() == 5 and 8 <= d.day <= 14

    @staticmethod
    def is_fourth_saturday(d: date) -> bool:
        """Fourth Saturday of the month (Court Closed)."""
        return d.weekday() == 5 and 22 <= d.day <= 28

    @staticmethod
    def get_gazetted_holiday(d: date, bench_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        iso = d.isoformat()
        bench_filter = (bench_id or "ALL").upper()
        for h in GAZETTED_HOLIDAYS_2026:
            if h["date"] == iso:
                if "ALL" in h["benches"] or bench_filter in h["benches"] or bench_filter == "ALL":
                    return h
        return None

    @staticmethod
    def get_vacation_for_date(d: date) -> Optional[Dict[str, Any]]:
        iso = d.isoformat()
        for v in COURT_VACATIONS_2026:
            if v["start_date"] <= iso <= v["end_date"]:
                return v
        return None

    @classmethod
    def get_day_status(cls, d: date, bench_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Determines the institutional status of a date for the High Court.
        Returns detailed classification, holiday labels, and working status.
        """
        iso = d.isoformat()
        weekday = d.weekday()  # Monday is 0 and Sunday is 6

        # 1. Sunday: Closed Weekend
        if weekday == 6:
            return {
                "date": iso,
                "is_working_day": False,
                "status": "SUNDAY",
                "label_en": "Sunday (Weekly Off)",
                "label_hi": "रविवार (साप्ताहिक अवकाश)",
                "category": "WEEKEND_CLOSED",
                "description": "High Court Benches & Registry Closed",
                "is_holiday": True,
                "is_vacation": False
            }

        # 2. Second or Fourth Saturday: Closed Weekend
        if cls.is_second_saturday(d):
            return {
                "date": iso,
                "is_working_day": False,
                "status": "SECOND_SATURDAY",
                "label_en": "Second Saturday (Court Closed)",
                "label_hi": "द्वितीय शनिवार (न्यायालयीन अवकाश)",
                "category": "WEEKEND_CLOSED",
                "description": "High Court Statutory Second Saturday Off",
                "is_holiday": True,
                "is_vacation": False
            }

        if cls.is_fourth_saturday(d):
            return {
                "date": iso,
                "is_working_day": False,
                "status": "FOURTH_SATURDAY",
                "label_en": "Fourth Saturday (Court Closed)",
                "label_hi": "चतुर्थ शनिवार (न्यायालयीन अवकाश)",
                "category": "WEEKEND_CLOSED",
                "description": "High Court Statutory Fourth Saturday Off",
                "is_holiday": True,
                "is_vacation": False
            }

        # 3. Gazetted / Bench Holiday
        gh = cls.get_gazetted_holiday(d, bench_id)
        if gh:
            return {
                "date": iso,
                "is_working_day": False,
                "status": gh["type"],
                "label_en": gh["name_en"],
                "label_hi": gh["name_hi"],
                "category": "GAZETTED_HOLIDAY",
                "description": gh["description"],
                "is_holiday": True,
                "is_vacation": False,
                "benches": gh["benches"]
            }

        # 4. High Court Vacation / Recess
        vac = cls.get_vacation_for_date(d)
        if vac:
            return {
                "date": iso,
                "is_working_day": False,
                "status": "COURT_VACATION",
                "label_en": vac["name_en"],
                "label_hi": vac["name_hi"],
                "category": "COURT_VACATION",
                "description": vac["description"],
                "is_holiday": True,
                "is_vacation": True
            }

        # 5. Non-Sitting Saturday (1st, 3rd, 5th Saturday)
        if weekday == 5:
            return {
                "date": iso,
                "is_working_day": False,
                "status": "SATURDAY_NON_SITTING",
                "label_en": "Saturday (Registry Non-Sitting)",
                "label_hi": "शनिवार (न्यायालयीन गैर-बैठक दिवस)",
                "category": "WEEKEND_CLOSED",
                "description": "High Court Benches Non-Sitting; Urgent Registry Work Only",
                "is_holiday": True,
                "is_vacation": False
            }

        # 6. Official Court Working Day
        return {
            "date": iso,
            "is_working_day": True,
            "status": "COURT_WORKING_DAY",
            "label_en": "Court Sitting Day",
            "label_hi": "न्यायालयीन कार्य दिवस",
            "category": "WORKING_DAY",
            "description": "Regular Commercial Division Court Hall Sitting",
            "is_holiday": False,
            "is_vacation": False
        }

    @classmethod
    def get_next_working_day(cls, d: date, bench_id: Optional[str] = None) -> date:
        """
        [Section 10 General Clauses Act / Limitation Act]
        Calculates the immediate next working court day if the given date is
        a holiday, vacation, or closed weekend.
        """
        curr = d + timedelta(days=1)
        # Look ahead up to 60 days
        for _ in range(60):
            st = cls.get_day_status(curr, bench_id)
            if st["is_working_day"]:
                return curr
            curr += timedelta(days=1)
        return curr

    @classmethod
    def get_month_calendar(cls, year: int, month: int, bench_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Generates all dates for a given month with complete status details."""
        import calendar
        num_days = calendar.monthrange(year, month)[1]
        days = []
        for day in range(1, num_days + 1):
            d = date(year, month, day)
            st = cls.get_day_status(d, bench_id)
            days.append({
                **st,
                "day_number": day,
                "day_of_week": d.strftime("%a"),
                "day_of_week_full": d.strftime("%A"),
            })
        return days

    @classmethod
    def get_annual_overview(cls, year: int = 2026, bench_id: Optional[str] = None) -> Dict[str, Any]:
        """Provides statistics and holiday rosters for the entire year."""
        total_days = 365
        working_days = 0
        holidays_count = 0
        sundays_count = 0
        closed_sats_count = 0
        vacation_days_count = 0

        start_d = date(year, 1, 1)
        for offset in range(365):
            d = start_d + timedelta(days=offset)
            st = cls.get_day_status(d, bench_id)
            if st["is_working_day"]:
                working_days += 1
            else:
                holidays_count += 1
                if st["status"] == "SUNDAY":
                    sundays_count += 1
                elif st["status"] in ("SECOND_SATURDAY", "FOURTH_SATURDAY"):
                    closed_sats_count += 1
                elif st["category"] == "COURT_VACATION":
                    vacation_days_count += 1

        return {
            "year": year,
            "bench_id": bench_id or "ALL",
            "total_days": total_days,
            "working_days": working_days,
            "total_non_working_days": holidays_count,
            "gazetted_holidays_count": len(GAZETTED_HOLIDAYS_2026),
            "sundays_count": sundays_count,
            "closed_saturdays_count": closed_sats_count,
            "vacation_days_count": vacation_days_count,
            "gazetted_holidays": GAZETTED_HOLIDAYS_2026,
            "vacations": COURT_VACATIONS_2026
        }
