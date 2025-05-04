from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc 
from app.models.note import Note 
from app.models.user import User
from app.models.schemas import NoteCreate, UserCreate
from app.ml.sentiment import analyze_sentiment
from app.api.auth import get_password_hash
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

# User operations
def get_user(db: Session, user_id: int):
    """
    Get a user by ID.
    """
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    """
    Get a user by username.
    """
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    """
    Get a user by email.
    """
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all users with pagination.
    """
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    """
    Create a new user.
    """
    logger = logging.getLogger(__name__)
    logger.info(f"Creating user with username: {user.username}, email: {user.email}")
    
    try:
        # Check if username already exists
        logger.info(f"Checking if username '{user.username}' already exists")
        existing_user = get_user_by_username(db, user.username)
        if existing_user:
            logger.warning(f"Username '{user.username}' already registered")
            raise HTTPException(status_code=400, detail="Username already registered")
        
        # Check if email already exists
        logger.info(f"Checking if email '{user.email}' already exists")
        existing_email = get_user_by_email(db, user.email)
        if existing_email:
            logger.warning(f"Email '{user.email}' already registered")
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Hash the password
        logger.info("Hashing password")
        hashed_password = get_password_hash(user.password)
        
        # Create user instance
        logger.info("Creating user instance")
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )
        
        # Add to database
        logger.info("Adding user to database")
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"User created successfully: {user.username}")
        return db_user
    except HTTPException as http_exc:
        # Re-raise HTTPExceptions directly
        logger.error(f"HTTP exception during user creation: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        logger.error(f"Unexpected error during user creation: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")