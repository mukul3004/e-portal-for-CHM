import pytest
from fastapi.testclient import TestClient
from backend.app.main import app, seed_initial_users
from backend.app.database import Base, engine

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    seed_initial_users()
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
