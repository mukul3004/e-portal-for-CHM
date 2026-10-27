import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.database import SessionLocal
from backend.app.models.user import User, RoleType
from backend.app.models.case import Case
from backend.app.models.schedule import CourtRoom
from backend.app.security.hashing import hash_password

def seed_extended_roster():
    db = SessionLocal()
    try:
        print("[INFO] Seeding extended judicial and legal roster...")
        
        # 1. Additional Courtrooms
        courtrooms = [
            CourtRoom(hall_id="HALL_01", hall_name="Commercial Division Courtroom Hall 1", district="MP High Court, Jabalpur (Principal Seat)"),
            CourtRoom(hall_id="HALL_02", hall_name="Commercial Division Courtroom Hall 2", district="MP High Court, Gwalior Bench"),
            CourtRoom(hall_id="HALL_03", hall_name="District Commercial Courtroom Hall 3", district="Commercial Court, Indore"),
            CourtRoom(hall_id="HALL_04", hall_name="Commercial Courtroom Hall 4", district="Indore Commercial Court"),
        ]
        for room in courtrooms:
            existing = db.query(CourtRoom).filter(CourtRoom.hall_id == room.hall_id).first()
            if not existing:
                db.add(room)
        db.commit()

        # 2. Judges Roster
        judges_data = [
            {
                "email": "judge.sharma@svvv-courts.gov.in",
                "full_name": "Hon'ble Justice Rajesh Sharma",
                "role": RoleType.JUDGE,
                "bench_id": "BENCH_INDORE_COMM_01",
                "court_hall_id": "HALL_04"
            },
            {
                "email": "judge.verma@svvv-courts.gov.in",
                "full_name": "Hon'ble Justice Alok Verma",
                "role": RoleType.JUDGE,
                "bench_id": "BENCH_JABALPUR_COMM_01",
                "court_hall_id": "HALL_01"
            },
            {
                "email": "judge.mehta@svvv-courts.gov.in",
                "full_name": "Hon'ble Justice Meenakshi Mehta",
                "role": RoleType.JUDGE,
                "bench_id": "BENCH_GWALIOR_COMM_01",
                "court_hall_id": "HALL_02"
            },
            {
                "email": "judge.jain@svvv-courts.gov.in",
                "full_name": "Hon'ble Judge Satyendra K. Jain",
                "role": RoleType.JUDGE,
                "bench_id": "BENCH_INDORE_DIST_COMM",
                "court_hall_id": "HALL_03"
            }
        ]

        # 3. Advocates Roster
        advocates_data = [
            {
                "email": "adv.himanshu@barcouncil.org",
                "full_name": "Adv. Himanshu Bawaniya",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/14297/2026"
            },
            {
                "email": "adv.verma@barcouncil.org",
                "full_name": "Adv. Priya Verma",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/11054/2026"
            },
            {
                "email": "adv.joshi@barcouncil.org",
                "full_name": "Adv. Arvind K. Joshi",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/08942/2024"
            },
            {
                "email": "adv.saxena@barcouncil.org",
                "full_name": "Adv. Rohit Saxena",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/16723/2025"
            },
            {
                "email": "adv.singhania@barcouncil.org",
                "full_name": "Adv. Sneha Singhania",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/19082/2026"
            },
            {
                "email": "adv.rathore@barcouncil.org",
                "full_name": "Adv. Vikramaditya Rathore",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/07431/2023"
            },
            {
                "email": "adv.pathak@barcouncil.org",
                "full_name": "Adv. Nandita Pathak",
                "role": RoleType.ADVOCATE,
                "bar_council_id": "MP/22190/2026"
            }
        ]

        # 4. Clerks Roster
        clerks_data = [
            {
                "email": "clerk.indore@svvv-courts.gov.in",
                "full_name": "Court Clerk Sunita Rao",
                "role": RoleType.CLERK,
                "court_hall_id": "HALL_04"
            },
            {
                "email": "reader.prasad@svvv-courts.gov.in",
                "full_name": "Reader Rajeshwar Prasad",
                "role": RoleType.CLERK,
                "court_hall_id": "HALL_01"
            },
            {
                "email": "registrar.sharma@svvv-courts.gov.in",
                "full_name": "Deputy Registrar Anand Sharma",
                "role": RoleType.CLERK,
                "court_hall_id": "CENTRAL_REGISTRY"
            }
        ]

        all_user_records = {}

        for jd in judges_data:
            u = db.query(User).filter(User.email == jd["email"]).first()
            if not u:
                u = User(
                    email=jd["email"],
                    password_hash=hash_password("Judge@2026"),
                    full_name=jd["full_name"],
                    role=jd["role"],
                    bench_id=jd["bench_id"],
                    court_hall_id=jd["court_hall_id"]
                )
                db.add(u)
                db.commit()
                db.refresh(u)
            all_user_records[jd["email"]] = u

        for ad in advocates_data:
            u = db.query(User).filter(User.email == ad["email"]).first()
            if not u:
                u = User(
                    email=ad["email"],
                    password_hash=hash_password("Advocate@2026"),
                    full_name=ad["full_name"],
                    role=ad["role"],
                    bar_council_id=ad["bar_council_id"]
                )
                db.add(u)
                db.commit()
                db.refresh(u)
            all_user_records[ad["email"]] = u

        for cd in clerks_data:
            u = db.query(User).filter(User.email == cd["email"]).first()
            if not u:
                u = User(
                    email=cd["email"],
                    password_hash=hash_password("Clerk@2026"),
                    full_name=cd["full_name"],
                    role=cd["role"],
                    court_hall_id=cd["court_hall_id"]
                )
                db.add(u)
                db.commit()
                db.refresh(u)
            all_user_records[cd["email"]] = u

        print(f"[SUCCESS] Total registered system users: {len(all_user_records)}")

        # 5. Distribute realistic advocates and judges across all cases
        cases = db.query(Case).all()
        print(f"[INFO] Distributing realistic counsels and judges across {len(cases)} cases...")

        judges_list = [all_user_records[jd["email"]] for jd in judges_data]
        advocates_list = [all_user_records[ad["email"]] for ad in advocates_data]

        for i, c in enumerate(cases):
            # Select Judge based on court location if possible
            court_str = c.court_hall_id or ""
            if "Jabalpur" in court_str:
                selected_judge = all_user_records["judge.verma@svvv-courts.gov.in"]
            elif "Gwalior" in court_str:
                selected_judge = all_user_records["judge.mehta@svvv-courts.gov.in"]
            elif "District Court" in court_str and i % 2 == 0:
                selected_judge = all_user_records["judge.jain@svvv-courts.gov.in"]
            else:
                selected_judge = all_user_records["judge.sharma@svvv-courts.gov.in"]

            # Select distinct Plaintiff and Defendant Counsel
            plaintiff_adv = advocates_list[i % len(advocates_list)]
            defendant_adv = advocates_list[(i + 3) % len(advocates_list)]
            if plaintiff_adv.id == defendant_adv.id:
                defendant_adv = advocates_list[(i + 1) % len(advocates_list)]

            c.judge_id = selected_judge.id
            c.plaintiff_counsel_id = plaintiff_adv.id
            c.defendant_counsel_id = defendant_adv.id

        db.commit()
        print(f"[SUCCESS] Updated {len(cases)} cases with realistic diverse advocates and judges!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to seed extended roster: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_extended_roster()
