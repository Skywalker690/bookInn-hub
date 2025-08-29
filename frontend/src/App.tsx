import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import BookingForm from './pages/BookingForm';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import FindBooking from './pages/FindBooking';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthUtils } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const isAuthenticated = AuthUtils.isAuthenticated();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Container fluid className="mt-3">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/find-booking" element={<FindBooking />} />
            
            {/* Auth routes - redirect if already authenticated */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
            />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book/:roomId" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes - require admin role */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
