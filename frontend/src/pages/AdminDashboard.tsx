import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Alert variant="info">
        <h4>Admin Dashboard Page</h4>
        <p>This page is under development. It will provide admin functionality for managing rooms, users, and bookings.</p>
      </Alert>
    </Container>
  );
};

export default AdminDashboard;