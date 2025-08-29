import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { RoomDTO, RoomSearchParams } from '../types';
import { DateUtils, CurrencyUtils } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Initialize search parameters from URL or defaults
  const [filters, setFilters] = useState<RoomSearchParams>({
    checkInDate: searchParams.get('checkIn') || DateUtils.getTodayString(),
    checkOutDate: searchParams.get('checkOut') || DateUtils.getTomorrowString(),
    roomType: searchParams.get('type') || ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Perform search when component loads with URL params
    if (searchParams.get('checkIn') || searchParams.get('checkOut') || searchParams.get('type')) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const [roomsResponse, typesResponse] = await Promise.all([
        roomAPI.getAllAvailableRooms(),
        roomAPI.getRoomTypes()
      ]);

      if (roomsResponse.statusCode === 200) {
        setRooms(roomsResponse.roomList || []);
      }
      
      setRoomTypes(typesResponse);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setError('');

      let response;
      if (filters.checkInDate && filters.checkOutDate && filters.roomType) {
        // Search with all filters
        response = await roomAPI.getAvailableRoomsByDateAndType(filters);
      } else {
        // Get all available rooms
        response = await roomAPI.getAllAvailableRooms();
      }

      if (response.statusCode === 200) {
        setRooms(response.roomList || []);
        
        // Update URL with search parameters
        const params = new URLSearchParams();
        if (filters.checkInDate) params.set('checkIn', filters.checkInDate);
        if (filters.checkOutDate) params.set('checkOut', filters.checkOutDate);
        if (filters.roomType) params.set('type', filters.roomType);
        setSearchParams(params);
      } else {
        setError(response.message || 'No rooms found for your search criteria.');
        setRooms([]);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to search rooms. Please try again.'
      );
      setRooms([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      checkInDate: DateUtils.getTodayString(),
      checkOutDate: DateUtils.getTomorrowString(),
      roomType: ''
    });
    setSearchParams(new URLSearchParams());
    fetchInitialData();
  };

  const hasActiveFilters = filters.checkInDate !== DateUtils.getTodayString() || 
                          filters.checkOutDate !== DateUtils.getTomorrowString() || 
                          filters.roomType !== '';

  if (loading) return <LoadingSpinner message="Loading rooms..." />;

  return (
    <Container>
      <h1 className="mb-4">Available Rooms</h1>

      {/* Search Filters */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Search & Filter Rooms</h5>
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
                    value={filters.checkInDate}
                    onChange={handleFilterChange}
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
                    value={filters.checkOutDate}
                    onChange={handleFilterChange}
                    min={filters.checkInDate || DateUtils.getTomorrowString()}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Type</Form.Label>
                  <Form.Select
                    name="roomType"
                    value={filters.roomType}
                    onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
                  >
                    <option value="">All Room Types</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end gap-2">
                <Button 
                  variant="primary" 
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="flex-grow-1 mb-3"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
                {hasActiveFilters && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters}
                    className="mb-3"
                  >
                    Clear
                  </Button>
                )}
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

      {/* Results */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>
          {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
          {hasActiveFilters && <Badge bg="secondary" className="ms-2">Filtered</Badge>}
        </h5>
      </div>

      {rooms.length > 0 ? (
        <Row>
          {rooms.map(room => (
            <Col lg={4} md={6} key={room.id} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={room.roomPhotoUrl || '/placeholder-room.jpg'} 
                  alt={room.roomType}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{room.roomType}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {room.roomDescription || 'Comfortable and well-equipped room for your perfect stay.'}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h5 text-primary mb-0">
                        {CurrencyUtils.formatPrice(room.roomPrice)}/night
                      </span>
                    </div>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => navigate(`/rooms/${room.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(`/book/${room.id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : !loading && !searchLoading && (
        <Alert variant="info">
          <h5>No rooms available</h5>
          <p>
            No rooms match your search criteria. Try adjusting your filters or check back later.
          </p>
          {hasActiveFilters && (
            <Button variant="outline-primary" onClick={clearFilters}>
              Show All Available Rooms
            </Button>
          )}
        </Alert>
      )}
    </Container>
  );
};

export default Rooms;