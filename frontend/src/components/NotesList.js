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
      <h2 className="mb-4">Your Notes</h2>
      <Row>
        {notes.map(note => (
          <Col md={6} lg={4} key={note.id}>
            <Card className="note-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{note.title}</span>
                  {getSentimentBadge(note.sentiment)}
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Text>{note.content}</Card.Text>
                {!note.sentiment && (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleAnalyze(note.id)}
                    disabled={analyzingIds.includes(note.id)}
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
                )}
              </Card.Body>
              <Card.Footer className="text-muted">
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