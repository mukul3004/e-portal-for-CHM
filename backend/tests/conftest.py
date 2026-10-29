import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Set environment variables for test isolation before backend imports
TEST_DB_FILE = os.path.abspath(os.path.join(PROJECT_ROOT, "test_portal.db"))
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_FILE}"
os.environ["JWT_SECRET_KEY"] = "ci-testing-secret-key-for-svvv-high-court-portal"

import backend.app.database as db_module
from backend.app.database import Base, get_db
from backend.app.config import settings
from backend.app.models.user import User, RoleType
from backend.app.security.hashing import hash_password
from backend.app.patterns.singleton import DatabaseConnectionPoolSingleton
from backend.app.main import app
from fastapi.testclient import TestClient

# Create dedicated test engine and session factory
test_engine = create_engine(
    f"sqlite:///{TEST_DB_FILE}",
    connect_args={"check_same_thread": False},
    echo=False
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Rebind database module references to test engine
db_module.engine = test_engine
db_module.SessionLocal = TestingSessionLocal
settings.DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"


def seed_test_users(db):
    """Seed initial demo users required for API and login tests."""
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
            email="judge.verma@svvv-courts.gov.in",
            password_hash=hash_password("Judge@2026"),
            full_name="Hon'ble Justice Alok Verma",
            role=RoleType.JUDGE,
            bench_id="BENCH_JABALPUR_COMM_01",
            court_hall_id="HALL_01"
        ),
        User(
            email="judge.mehta@svvv-courts.gov.in",
            password_hash=hash_password("Judge@2026"),
            full_name="Hon'ble Justice Meenakshi Mehta",
            role=RoleType.JUDGE,
            bench_id="BENCH_GWALIOR_COMM_01",
            court_hall_id="HALL_02"
        ),
        User(
            email="judge.jain@svvv-courts.gov.in",
            password_hash=hash_password("Judge@2026"),
            full_name="Hon'ble Judge Satyendra K. Jain",
            role=RoleType.JUDGE,
            bench_id="BENCH_INDORE_DIST_COMM",
            court_hall_id="HALL_03"
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
            email="adv.patel@barcouncil.org",
            password_hash=hash_password("Advocate@2026"),
            full_name="Adv. Vikram Patel",
            role=RoleType.ADVOCATE,
            bar_council_id="MP/08942/2026"
        ),
    ]
    db.add_all(demo_users)
    db.commit()


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Remove existing test DB if any
    if os.path.exists(TEST_DB_FILE):
        os.remove(TEST_DB_FILE)

    # Reset singleton pool to point to test_engine
    singleton = DatabaseConnectionPoolSingleton._instance
    if singleton:
        singleton._engine = test_engine
        singleton._session_factory = TestingSessionLocal

    Base.metadata.create_all(bind=test_engine)

    db = TestingSessionLocal()
    try:
        seed_test_users(db)
    finally:
        db.close()

    yield

    # Teardown: clean up test database file
    if os.path.exists(TEST_DB_FILE):
        try:
            os.remove(TEST_DB_FILE)
        except OSError:
            pass


@pytest.fixture
def db_session():
    """Provides an isolated database session for tests."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client():
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
