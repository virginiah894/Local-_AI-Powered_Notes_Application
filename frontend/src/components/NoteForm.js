import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    // Form validation
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the onAddNote function passed from parent
      const success = await onAddNote({ title, content });
      
      if (success) {
        // Reset form on success
        setTitle('');
        setContent('');
        setValidated(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="note-form">
      <Card.Header as="h5">Add a New Note</Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="noteTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={1}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="noteContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter content (minimum 10 characters)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
            />
            <Form.Control.Feedback type="invalid">
              Content must be at least 10 characters long.
            </Form.Control.Feedback>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NoteForm;