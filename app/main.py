from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys

from app.api import notes, users
from app.database.database import engine, Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Notes API",
    description="A FastAPI application for creating and analyzing notes with sentiment analysis",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8001"],  # Explicitly allow frontend origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
)

# Include routers
logger.info("Registering users router")
app.include_router(users.router)
logger.info("Registering notes router")
app.include_router(notes.router)
logger.info("All routers registered successfully")

# Root endpoint
@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "Welcome to the AI-Powered Notes API",
        "docs": "/docs",
        "endpoints": {
            "notes": "/notes",
            "users": "/users",
            "analyze": "/notes/{id}/analyze"
        }
    }

# Log application startup
logger.info("Application initialized successfully")