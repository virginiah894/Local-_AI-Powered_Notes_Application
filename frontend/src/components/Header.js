import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const Header = () => {
  return (
    <header className="app-header">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <span role="img" aria-label="notebook">📝</span> AI-Powered Notes App
          </Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;