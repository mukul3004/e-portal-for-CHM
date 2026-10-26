from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import User, RoleType, CourtRoom
from backend.app.security.hashing import hash_password
from backend.app.routers import auth, cases, admissions, schedule

def seed_initial_users():
    """Seeds default demo users if database is empty."""
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() == 0:
            demo_users = [
                User(
                    email="judge.sharma@svvv-courts.gov.in",
                    password_hash=hash_password("Judge@2026"),
                    full_name="Hon'ble Justice Rajesh Sharma",
                    role=RoleType.JUDGE,
                    bench_id="BENCH_INDORE_COMM_01",
                    court_hall_id="HALL_04"
                ),
                User(
                    email="adv.himanshu@barcouncil.org",
                    password_hash=hash_password("Advocate@2026"),
                    full_name="Adv. Himanshu Bawaniya",
                    role=RoleType.ADVOCATE,
                    bar_council_id="MP/14297/2026"
                ),
                User(
                    email="adv.verma@barcouncil.org",
                    password_hash=hash_password("Advocate@2026"),
                    full_name="Adv. Priya Verma",
                    role=RoleType.ADVOCATE,
                    bar_council_id="MP/11054/2026"
                ),
                User(
                    email="clerk.indore@svvv-courts.gov.in",
                    password_hash=hash_password("Clerk@2026"),
                    full_name="Court Clerk Sunita Rao",
                    role=RoleType.CLERK,
                    court_hall_id="HALL_04"
                ),
            ]
            db.add_all(demo_users)
            
            # Seed default courtroom
            hall = CourtRoom(hall_id="HALL_04", hall_name="Commercial Courtroom Hall 4", district="Indore Commercial Court")
            db.add(hall)
            
            db.commit()
            print("[INFO] Seeded default judicial demo users successfully.")
    except Exception as e:
        db.rollback()
        print(f"[WARN] Error seeding demo users: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize all database tables
    Base.metadata.create_all(bind=engine)
    seed_initial_users()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Interactive e-Portal for Case Management Hearing under Order XV-A CPC (Commercial Courts Act, 2015).",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(admissions.router, prefix=settings.API_V1_STR)
app.include_router(schedule.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["System Health"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "Operational",
        "statutory_framework": "Order XV-A Code of Civil Procedure (CPC)",
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc"
    }
