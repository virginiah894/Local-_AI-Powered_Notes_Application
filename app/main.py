from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.api import notes
from app.database.database import engine, Base
from app.api.auth import get_api_key

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Notes API",
    description="A FastAPI application for creating and analyzing notes with sentiment analysis",
    version="0.1.0",
    dependencies=[Depends(get_api_key)]
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(notes.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the AI-Powered Notes API",
        "docs": "/docs",
        "endpoints": {
            "notes": "/notes",
            "analyze": "/notes/{id}/analyze"
        }
    }