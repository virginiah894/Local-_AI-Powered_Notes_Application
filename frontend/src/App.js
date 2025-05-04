import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import Header from './components/Header';
import { fetchNotes, createNote, analyzeNote } from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Load notes from API
  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await fetchNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new note
  const handleAddNote = async (note) => {
    try {
      setLoading(true);
      const newNote = await createNote(note);
      setNotes([newNote, ...notes]);
      return true;
    } catch (err) {
      setError('Failed to add note. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Analyze note sentiment
  const handleAnalyzeNote = async (noteId) => {
    try {
      setLoading(true);
      const analyzedNote = await analyzeNote(noteId);
      
      // Update the note in the state
      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, sentiment: analyzedNote.sentiment } : note
      ));
      
      return analyzedNote.sentiment;
    } catch (err) {
      setError('Failed to analyze note. Please try again.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Container>
          {error && <div className="alert alert-danger">{error}</div>}
          <Row>
            <Col lg={3} md={2} sm={1}></Col>
            <Col lg={6} md={8} sm={10}>
              <NoteForm onAddNote={handleAddNote} />
            </Col>
            <Col lg={3} md={2} sm={1}></Col>
          </Row>
          <Row>
            <Col>
              <NotesList
                notes={notes}
                loading={loading}
                onAnalyze={handleAnalyzeNote}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;