import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthUtils } from '../../utils';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthUtils.isAuthenticated();
  const isAdmin = AuthUtils.isAdmin();
  const currentUser = AuthUtils.getCurrentUser();

  const handleLogout = () => {
    AuthUtils.clearAuthData();
    navigate('/');
    window.location.reload(); // Force refresh to update auth state
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>
            <strong>BookInn Hub</strong>
          </BootstrapNavbar.Brand>
        </LinkContainer>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/rooms">
              <Nav.Link>Rooms</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/find-booking">
              <Nav.Link>Find Booking</Nav.Link>
            </LinkContainer>
            {isAdmin && (
              <LinkContainer to="/admin">
                <Nav.Link>Admin Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <LinkContainer to="/profile">
                  <Nav.Link>
                    Welcome, {currentUser?.name || 'User'}
                  </Nav.Link>
                </LinkContainer>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;