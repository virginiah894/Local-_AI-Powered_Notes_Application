import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import { fetchNotes, createNote, analyzeNote } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // Default to login tab
  
  const { currentUser, handleLogout, loading: authLoading } = useAuth();
  const authenticated = !!currentUser;
  
  // Set active tab based on authentication state
  useEffect(() => {
    console.log('App: Authentication state changed', { authenticated, authLoading });
    if (authenticated) {
      console.log('App: User is authenticated, switching to notes tab');
      setActiveTab('notes');
    } else if (!authLoading) {
      console.log('App: User is not authenticated, switching to login tab');
      setActiveTab('login');
    }
  }, [authenticated, authLoading]);

  // Fetch notes on component mount if authenticated
  useEffect(() => {
    if (authenticated) {
      loadNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [authenticated]);

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

  // Handle successful login
  const handleLoginSuccess = () => {
    console.log('App: Login success handler in App.js called');
    setActiveTab('notes');
    loadNotes();
  };

  // Render authentication tabs if not authenticated
  const renderAuthTabs = () => {
    return (
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="login" title="Login">
          <Login onLoginSuccess={handleLoginSuccess} />
        </Tab>
        <Tab eventKey="register" title="Register">
          <Register
            onRegisterSuccess={(username) => {
              console.log('App: Registration successful, switching to login tab');
              // Force a delay to ensure the tab switch happens after the alert
              setTimeout(() => {
                // Set the username in the login form if provided
                if (username) {
                  // We need to find a way to pass the username to the Login component
                  // For now, we'll use localStorage as a temporary solution
                  localStorage.setItem('lastRegisteredUsername', username);
                }
                setActiveTab('login');
              }, 500);
            }}
          />
        </Tab>
      </Tabs>
    );
  };

  // Render notes content if authenticated
  const renderNotesContent = () => {
    return (
      <div className="main-content" style={{ color: 'white' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {currentUser?.username}</h2>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
        </div>
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
    );
  };

  return (
    <div className="app">
      <Header />
      <Container>
        {authenticated ? renderNotesContent() : renderAuthTabs()}
      </Container>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
