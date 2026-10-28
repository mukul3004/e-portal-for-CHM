import pytest
from fastapi.testclient import TestClient
from backend.app.main import app, seed_initial_users
from backend.app.database import Base, engine, SessionLocal

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    seed_initial_users()
    yield

@pytest.fixture
def db_session():
    """Provides a transactional database session for tests."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
