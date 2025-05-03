from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.database import Base, get_db
from app.api.auth import API_KEY

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Setup test database
Base.metadata.create_all(bind=engine)

# Override get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

# Test data
test_note = {
    "title": "Test Note",
    "content": "This is a test note with enough characters for validation."
}

# Test headers with API key
headers = {"X-API-Key": API_KEY}

def test_read_main():
    """Test the root endpoint."""
    response = client.get("/", headers=headers)
    assert response.status_code == 200
    assert "Welcome to the AI-Powered Notes API" in response.json()["message"]

def test_create_note():
    """Test creating a note."""
    response = client.post("/notes/", json=test_note, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == test_note["title"]
    assert data["content"] == test_note["content"]
    assert "id" in data
    return data["id"]

def test_read_notes():
    """Test reading all notes."""
    response = client.get("/notes/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_note():
    """Test reading a specific note."""
    # First create a note
    note_id = test_create_note()
    
    # Then read it
    response = client.get(f"/notes/{note_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_note["title"]
    assert data["content"] == test_note["content"]

def test_analyze_note():
    """Test analyzing a note's sentiment."""
    # First create a note
    note_id = test_create_note()
    
    # Then analyze it
    response = client.get(f"/notes/{note_id}/analyze", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert data["sentiment"] in ["positive", "neutral", "negative"]

def test_invalid_api_key():
    """Test that invalid API key is rejected."""
    invalid_headers = {"X-API-Key": "invalid_key"}
    response = client.get("/", headers=invalid_headers)
    assert response.status_code == 403
    assert "Invalid API Key" in response.json()["detail"]

def test_validation_error():
    """Test input validation."""
    invalid_note = {
        "title": "",  # Empty title should fail validation
        "content": "Too short"  # Content less than 10 chars should fail
    }
    response = client.post("/notes/", json=invalid_note, headers=headers)
    assert response.status_code == 422  # Unprocessable Entity