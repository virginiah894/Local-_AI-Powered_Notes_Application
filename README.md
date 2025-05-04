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
- React frontend for user interaction

## Technology Stack

- **Backend**: Python with FastAPI
- **Frontend**: React with Bootstrap
- **Database**: SQLite
- **ML**: TextBlob for sentiment analysis (polarity-based classification)
- **Authentication**: JWT (JSON Web Tokens)
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
- Node.js and npm (for frontend)

### Backend Setup

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

3. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend:
   ```
   python run.py
   ```

5. Access the API at http://localhost:8000
   - API documentation is available at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Run the frontend development server:
   ```
   npm start
   ```

4. Access the frontend at http://localhost:3000

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

For frontend tests:

```
cd frontend
npm test
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The workflow:

1. Runs on every push to main, master, and develop branches
2. Runs on pull requests to these branches
3. Executes backend tests using pytest
4. Executes frontend tests using React Testing Library

The CI/CD configuration can be found in `.github/workflows/ci.yml`.

## Security Features

- JWT (JSON Web Token) authentication
- Password hashing with bcrypt
- Protected API endpoints
- Secure token handling in frontend

## Future Improvements
- Add user management
- Add more advanced NLP features
- Implement note categories and tags