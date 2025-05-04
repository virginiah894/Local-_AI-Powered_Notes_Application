import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col, Spinner } from 'react-bootstrap';

const NotesList = ({ notes, loading, onAnalyze }) => {
  const [analyzingIds, setAnalyzingIds] = useState([]);

  // Handle analyze button click
  const handleAnalyze = async (noteId) => {
    setAnalyzingIds([...analyzingIds, noteId]);
    await onAnalyze(noteId);
    setAnalyzingIds(analyzingIds.filter(id => id !== noteId));
  };

  // Get badge variant based on sentiment
  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return null;
    
    let variant;
    switch (sentiment) {
      case 'positive':
        variant = 'success';
        break;
      case 'negative':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    
    return (
      <Badge 
        bg={variant} 
        className="sentiment-badge"
      >
        {sentiment}
      </Badge>
    );
  };

  if (loading && notes.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No notes yet. Add your first note above!</p>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <h2 className="mb-4 text-center text-white" >Your Notes</h2>
      <Row className="g-4">
        {notes.map(note => (
          <Col md={6} lg={4} key={note.id}>
            <Card className="note-card h-100">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{note.title}</span>
                  {getSentimentBadge(note.sentiment)}
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Card.Text className="flex-grow-1">{note.content}</Card.Text>
                {!note.sentiment && (
                  <div className="mt-auto pt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleAnalyze(note.id)}
                      disabled={analyzingIds.includes(note.id)}
                      className="w-100"
                    >
                      {analyzingIds.includes(note.id) ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Analyzing...</span>
                        </>
                      ) : (
                        'Analyze Sentiment'
                      )}
                    </Button>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="text-muted small">
                Created: {new Date(note.created_at).toLocaleString()}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NotesList;