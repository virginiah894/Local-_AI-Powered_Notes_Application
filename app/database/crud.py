from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc 
from app.models.note import Note 
from app.models.schemas import NoteCreate
from app.ml.sentiment import analyze_sentiment
import logging

def get_notes(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all notes with pagination, ordered by creation date (most recent first).
    """
    # Order by Note.created_at in descending order
   
    return db.query(Note).order_by(desc(Note.created_at)).offset(skip).limit(limit).all()

def get_note(db: Session, note_id: int):
    """
    Get a specific note by ID.
    """
    return db.query(Note).filter(Note.id == note_id).first()

def create_note(db: Session, note: NoteCreate):
    """
    Create a new note with validation.
    """
    if not note.title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    
    if len(note.content) < 10:
        raise HTTPException(
            status_code=400, 
            detail="Content must be at least 10 characters long"
        )
    
    try:
        db_note = Note(
            title=note.title,
            content=note.content,
            sentiment=None
        )
        
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

def analyze_note_sentiment(db: Session, note_id: int):
    """
    Analyze sentiment of a note and update the database.
    
    Args:
        db (Session): Database session
        note_id (int): ID of the note to analyze
        
    Returns:
        Note: The updated note with sentiment analysis
        None: If the note is not found
        
    Raises:
        HTTPException: If there's an error during sentiment analysis or database operations
    """
    logger = logging.getLogger(__name__)
    
    try:
        # Get note
        db_note = get_note(db, note_id)
        
        if db_note is None:
            logger.warning(f"Note with ID {note_id} not found")
            # Raise 404 if note not found for analysis endpoint
            raise HTTPException(status_code=404, detail=f"Note with ID {note_id} not found")
        
        logger.info(f"Analyzing sentiment for note ID {note_id}")
        
        # Analyze sentiment
        sentiment = analyze_sentiment(db_note.content)
        logger.info(f"Sentiment analysis result for note ID {note_id}: {sentiment}")
        
        # Update note with sentiment
        db_note.sentiment = sentiment
        db.commit()
        db.refresh(db_note)
        
        return db_note
        
    except HTTPException as http_exc:
        # Re-raise HTTPExceptions directly
        raise http_exc
    except Exception as e:
        db.rollback()
        logger.error(f"Error analyzing sentiment for note ID {note_id}: {str(e)}")
        # Raise a generic 500 error for other exceptions
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing sentiment: {str(e)}"
        )