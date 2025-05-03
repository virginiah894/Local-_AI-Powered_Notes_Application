# AI-Powered Notes Application

A local full-stack application that integrates machine learning (NLP) for sentiment analysis of notes.

## Features

- Create notes with title and content
- List all notes
- Analyze the sentiment of a note's content (positive, neutral, or negative)
- Store notes locally using SQLite
- API security with API key authentication
- Input validation
- Error handling

## Technology Stack

- **Backend**: Python with FastAPI
- **Database**: SQLite
- **ML**: TextBlob for sentiment analysis
- **Authentication**: API Key
- **Containerization**: Docker

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth.py         # Authentication middleware
│   │   └── notes.py        # API routes for notes
│   ├── database/
│   │   ├── crud.py         # CRUD operations
│   │   └── database.py     # Database connection
│   ├── ml/
│   │   └── sentiment.py    # Sentiment analysis module
│   ├── models/
│   │   ├── note.py         # SQLAlchemy models
│   │   └── schemas.py      # Pydantic schemas
│   └── main.py             # FastAPI application
├── tests/
│   └── test_api.py         # API tests
├── .gitignore
├── Dockerfile
├── README.md
├── requirements.txt
└── run.py                  # Script to run the application
```

## Setup and Installation

### Prerequisites

- Python 3.9+
- pip

### Local Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-powered-notes-app
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python run.py
   ```

5. Access the API at http://localhost:8000
   - API documentation is available at http://localhost:8000/docs

### Docker Setup

1. Build the Docker image:
   ```
   docker build -t notes-app .
   ```

2. Run the container:
   ```
   docker run -p 8000:8000 notes-app
   ```

3. Access the API at http://localhost:8000

## API Endpoints

- `GET /`: Root endpoint with API information
- `POST /notes/`: Create a new note
- `GET /notes/`: Get all notes
- `GET /notes/{id}`: Get a specific note
- `GET /notes/{id}/analyze`: Analyze the sentiment of a note

## Authentication

All API endpoints are protected with API key authentication. Include the API key in the request header:

```
X-API-Key: test_api_key
```

## Testing

Run the tests with:

```
pytest tests/
```

## Future Improvements

- Add a frontend using React or Angular
- Implement JWT authentication
- Add user management
- Implement CI/CD with GitHub Actions
- Use Docker Compose to run the app and database together