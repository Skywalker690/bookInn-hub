import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form,
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { RoomDTO, RoomSearchParams } from '../types';
import { DateUtils, CurrencyUtils } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState<RoomDTO[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Search form state
  const [searchParams, setSearchParams] = useState<RoomSearchParams>({
    checkInDate: DateUtils.getTodayString(),
    checkOutDate: DateUtils.getTomorrowString(),
    roomType: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured rooms and room types
      const [roomsResponse, typesResponse] = await Promise.all([
        roomAPI.getAllAvailableRooms(),
        roomAPI.getRoomTypes()
      ]);

      if (roomsResponse.statusCode === 200) {
        // Show first 3 rooms as featured
        setFeaturedRooms(roomsResponse.roomList?.slice(0, 3) || []);
      }
      
      setRoomTypes(typesResponse);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchParams.checkInDate) queryParams.append('checkIn', searchParams.checkInDate);
    if (searchParams.checkOutDate) queryParams.append('checkOut', searchParams.checkOutDate);
    if (searchParams.roomType) queryParams.append('type', searchParams.roomType);
    
    navigate(`/rooms?${queryParams.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner message="Loading homepage..." />;

  return (
    <Container>

      {/* Hero Section */}
      <div className="hero-section mb-5">
        <h1 className="display-3 fw-bold">Welcome to BookInn Hub</h1>
        <p className="lead fs-4">
          Discover luxury stays & book with confidence.
        </p>
        <Button 
          variant="light" 
          size="lg" 
          onClick={() => navigate('/rooms')}
          className="mt-3"
        >
          Explore Rooms
        </Button>
      </div>

      {/* Search Section */}
      <Card className="mb-5 search-card p-3">
        <Card.Header className="bg-white border-0">
          <h3 className="fw-bold">Find Your Perfect Room</h3>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Check-in Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="checkInDate"
                    value={searchParams.checkInDate}
                    onChange={handleInputChange}
                    min={DateUtils.getTodayString()}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Check-out Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="checkOutDate"
                    value={searchParams.checkOutDate}
                    onChange={handleInputChange}
                    min={searchParams.checkInDate || DateUtils.getTomorrowString()}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Type</Form.Label>
                  <Form.Select
                    name="roomType"
                    value={searchParams.roomType}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, roomType: e.target.value }))}
                  >
                    <option value="">All Room Types</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  onClick={handleSearch}
                  className="w-100 mb-3"
                >
                  Search Rooms
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Featured Rooms Section */}
      <h2 className="mb-4 fw-bold">Featured Rooms</h2>
      {featuredRooms.length > 0 ? (
        <Row>
          {featuredRooms.map(room => (
            <Col md={4} key={room.id} className="mb-4">
              <Card className="h-100 room-card position-relative">
                <span className="price-badge">
                  {CurrencyUtils.formatPrice(room.roomPrice)}/night
                </span>
                <Card.Img 
                  variant="top" 
                  src={room.roomPhotoUrl || '/placeholder-room.jpg'} 
                  alt={room.roomType}
                  style={{ height: '220px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold">{room.roomType}</Card.Title>
                  <Card.Text>
                    {room.roomDescription || 'Comfortable and well-equipped room for your perfect stay.'}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No rooms available at the moment. Please check back later.
        </Alert>
      )}

      {/* Call to Action */}
      <Row className="mt-5">
        <Col md={6}>
          <Card className="cta-card">
            <Card.Body className="text-center">
              <h4>Browse All Rooms</h4>
              <p>Explore our full collection of rooms and find the perfect match for your needs.</p>
              <Button variant="primary" onClick={() => navigate('/rooms')}>
                View All Rooms
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="cta-card">
            <Card.Body className="text-center">
              <h4>Find Your Booking</h4>
              <p>Already made a reservation? Look up your booking details using your confirmation code.</p>
              <Button variant="outline-primary" onClick={() => navigate('/find-booking')}>
                Find Booking
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
