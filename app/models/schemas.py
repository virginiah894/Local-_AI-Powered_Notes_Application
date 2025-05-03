from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the note")
    content: str = Field(..., min_length=10, description="Content of the note")

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    sentiment: Optional[str] = None
     

    class Config:
        from_attributes = True

class SentimentResponse(BaseModel):
    id: int
    sentiment: str
    
    class Config:
        from_attributes = True