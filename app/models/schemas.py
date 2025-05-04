from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

# Note schemas
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

# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
# Login schema
class UserLogin(BaseModel):
    username: str
    password: str