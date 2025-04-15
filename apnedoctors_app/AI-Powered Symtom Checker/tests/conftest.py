import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator
from fastapi.testclient import TestClient
from core.database import Base
from core.config import get_settings
from models.db_models import Patient, Diagnosis, MedicalRecord

# Test settings
settings = get_settings()
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

# Create test database engine
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    """Create test database engine"""
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(db_engine) -> Generator:
    """Create a fresh database session for each test"""
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client() -> Generator:
    """Create a test client using FastAPI TestClient"""
    from api import app
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def test_patient(db_session) -> Patient:
    """Create a test patient"""
    patient = Patient(
        first_name="Test",
        last_name="Patient",
        email="test@example.com",
        date_of_birth="1990-01-01",
        gender="M"
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient

@pytest.fixture
def test_medical_record(db_session, test_patient) -> MedicalRecord:
    """Create a test medical record"""
    record = MedicalRecord(
        patient_id=test_patient.id,
        allergies=["penicillin"],
        medications=["aspirin"],
        chronic_conditions=["hypertension"]
    )
    db_session.add(record)
    db_session.commit()
    db_session.refresh(record)
    return record

@pytest.fixture
def test_diagnosis(db_session, test_patient) -> Diagnosis:
    """Create a test diagnosis"""
    diagnosis = Diagnosis(
        patient_id=test_patient.id,
        symptoms=["headache", "fever"],
        diagnosis=[{"condition": "flu", "probability": 0.85}],
        confidence_score=0.85,
        risk_level="medium"
    )
    db_session.add(diagnosis)
    db_session.commit()
    db_session.refresh(diagnosis)
    return diagnosis