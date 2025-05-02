from sqlalchemy.orm import Session
from app.models.note import Note
from app.models.schemas import NoteCreate
from app.ml.sentiment import analyze_sentiment

def get_notes(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all notes with pagination.
    """
    return db.query(Note).offset(skip).limit(limit).all()

def get_note(db: Session, note_id: int):
    """
    Get a specific note by ID.
    """
    return db.query(Note).filter(Note.id == note_id).first()

def create_note(db: Session, note: NoteCreate):
    """
    Create a new note.
    """
    # Create note instance
    db_note = Note(
        title=note.title,
        content=note.content,
        sentiment=None  # Sentiment will be analyzed separately
    )
    
    # Add to database
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return db_note

def analyze_note_sentiment(db: Session, note_id: int):
    """
    Analyze sentiment of a note and update the database.
    """
    # Get note
    db_note = get_note(db, note_id)
    
    if db_note is None:
        return None
    
    # Analyze sentiment
    sentiment = analyze_sentiment(db_note.content)
    
    # Update note with sentiment
    db_note.sentiment = sentiment
    db.commit()
    db.refresh(db_note)
    
    return db_note