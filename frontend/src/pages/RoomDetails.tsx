import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { RoomDTO } from '../types';
import { CurrencyUtils, AuthUtils } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const isAuthenticated = AuthUtils.isAuthenticated();

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await roomAPI.getRoomById(parseInt(id));
      
      if (response.statusCode === 200 && response.room) {
        setRoom(response.room);
      } else {
        setError(response.message || 'Room not found');
      }
    } catch (err: any) {
      console.error('Error fetching room details:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load room details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/book/${id}` } } });
      return;
    }
    
    navigate(`/book/${id}`);
  };

  const handleBackToRooms = () => {
    navigate('/rooms');
  };

  if (loading) {
    return <LoadingSpinner message="Loading room details..." />;
  }

  if (error || !room) {
    return (
      <Container>
        <Alert variant="danger">
          <h4>Error Loading Room</h4>
          <p>{error || 'Room not found'}</p>
          <Button variant="outline-danger" onClick={handleBackToRooms}>
            Back to Rooms
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={handleBackToRooms}
          className="mb-3"
        >
          ← Back to Rooms
        </Button>
      </nav>

      <Row>
        {/* Room Image */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Img 
              variant="top" 
              src={room.roomPhotoUrl || '/placeholder-room.jpg'} 
              alt={room.roomType}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>

        {/* Room Info & Booking */}
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="h3">{room.roomType}</Card.Title>
              
              <div className="mb-3">
                <Badge bg="primary" className="me-2">Available</Badge>
                <Badge bg="secondary">Room #{room.id}</Badge>
              </div>

              <div className="mb-3">
                <span className="h4 text-primary">
                  {CurrencyUtils.formatPrice(room.roomPrice)}
                </span>
                <span className="text-muted">/night</span>
              </div>

              <div className="mb-4">
                <p className="text-muted mb-2">Description:</p>
                <p>
                  {room.roomDescription || 
                   'Experience comfort and luxury in this beautifully appointed room. Perfect for both business and leisure travelers.'}
                </p>
              </div>

              <div className="d-grid">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : isAuthenticated ? (
                    'Book This Room'
                  ) : (
                    'Login to Book'
                  )}
                </Button>
              </div>

              {!isAuthenticated && (
                <p className="text-center text-muted mt-2 mb-0">
                  <small>Please log in to make a reservation</small>
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Room Features */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Room Features & Amenities</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Standard Features:</h6>
                  <ul>
                    <li>Free Wi-Fi</li>
                    <li>Air Conditioning</li>
                    <li>Private Bathroom</li>
                    <li>24/7 Room Service</li>
                    <li>Daily Housekeeping</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Additional Amenities:</h6>
                  <ul>
                    <li>Flat-screen TV</li>
                    <li>Mini Refrigerator</li>
                    <li>Work Desk</li>
                    <li>Safe Box</li>
                    <li>Complimentary Toiletries</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Info */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h6>Booking Information:</h6>
              <Row>
                <Col md={4}>
                  <strong>Check-in:</strong> 3:00 PM
                </Col>
                <Col md={4}>
                  <strong>Check-out:</strong> 11:00 AM
                </Col>
                <Col md={4}>
                  <strong>Cancellation:</strong> Free until 24h before
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetails;