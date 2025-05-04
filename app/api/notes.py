from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database import crud
from app.models.schemas import NoteCreate, NoteResponse, SentimentResponse
from app.api.auth import get_current_active_user

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(note: NoteCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """
    Create a new note.
    """
    # Validate input (FastAPI will handle this automatically based on Pydantic models)
    return crud.create_note(db=db, note=note)

@router.get("/", response_model=List[NoteResponse])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """
    Get all notes with pagination.
    """
    notes = crud.get_notes(db, skip=skip, limit=limit)
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
def read_note(note_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """
    Get a specific note by ID.
    """
    db_note = crud.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@router.get("/{note_id}/analyze", response_model=SentimentResponse)
def analyze_note(note_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """
    Analyze the sentiment of a note.
    """
    db_note = crud.analyze_note_sentiment(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note