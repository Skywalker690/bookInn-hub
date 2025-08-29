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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState<RoomDTO[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Hotel carousel images - using high-quality hotel images
  const carouselImages = [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
  ];
  
  // Search form state
  const [searchParams, setSearchParams] = useState<RoomSearchParams>({
    checkInDate: DateUtils.getTodayString(),
    checkOutDate: DateUtils.getTomorrowString(),
    roomType: ''
  });

  useEffect(() => {
    fetchInitialData();
    
    // Carousel auto-rotate
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

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
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Carousel */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
        </div>
        
        {/* Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                BookInn Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Experience luxury, comfort, and exceptional hospitality in our premium accommodations
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/rooms')}
                className="btn-luxury text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Explore Rooms
              </button>
              <button
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Book Now
              </button>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-yellow-400 scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce-gentle">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll Down</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div id="search-section" className="bg-white py-16">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Stay</h2>
            <p className="text-xl text-gray-600">Search and book your ideal room with ease</p>
          </div>
          
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <Card.Body className="p-6 bg-gradient-to-r from-gray-50 to-white">
              <Form>
                <Row className="g-4">
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="font-semibold text-gray-700">Check-in Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkInDate"
                        value={searchParams.checkInDate}
                        onChange={handleInputChange}
                        min={DateUtils.getTodayString()}
                        className="rounded-lg border-2 border-gray-200 focus:border-yellow-400 transition-colors"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="font-semibold text-gray-700">Check-out Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkOutDate"
                        value={searchParams.checkOutDate}
                        onChange={handleInputChange}
                        min={searchParams.checkInDate || DateUtils.getTomorrowString()}
                        className="rounded-lg border-2 border-gray-200 focus:border-yellow-400 transition-colors"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="font-semibold text-gray-700">Room Type</Form.Label>
                      <Form.Select
                        name="roomType"
                        value={searchParams.roomType}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, roomType: e.target.value }))}
                        className="rounded-lg border-2 border-gray-200 focus:border-yellow-400 transition-colors"
                      >
                        <option value="">All Room Types</option>
                        {roomTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6} className="d-flex align-items-end">
                    <Button 
                      onClick={handleSearch}
                      className="w-100 btn-luxury border-0 py-3 font-semibold text-lg rounded-lg"
                    >
                      Search Rooms
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {error && (
        <Container className="py-4">
          <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-lg">
            {error}
          </Alert>
        </Container>
      )}

      {/* Featured Rooms Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Accommodations</h2>
            <p className="text-xl text-gray-600">Discover our most popular rooms and suites</p>
          </div>
          
          {featuredRooms.length > 0 ? (
            <Row className="g-4">
              {featuredRooms.map(room => (
                <Col lg={4} md={6} key={room.id} className="mb-4">
                  <Card className="h-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 rounded-2xl overflow-hidden">
                    <div className="relative overflow-hidden">
                      <Card.Img 
                        variant="top" 
                        src={room.roomPhotoUrl || '/placeholder-room.jpg'} 
                        alt={room.roomType}
                        className="h-64 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm">
                        Featured
                      </div>
                    </div>
                    <Card.Body className="p-6 bg-white">
                      <Card.Title className="text-2xl font-bold text-gray-800 mb-2">{room.roomType}</Card.Title>
                      <Card.Text className="text-gray-600 mb-4 flex-grow-1">
                        {room.roomDescription || 'Luxurious and well-appointed accommodation designed for your ultimate comfort and relaxation.'}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-3xl font-bold text-yellow-600">
                          {CurrencyUtils.formatPrice(room.roomPrice)}<span className="text-lg text-gray-500">/night</span>
                        </span>
                        <Button 
                          onClick={() => navigate(`/rooms/${room.id}`)}
                          className="btn-luxury border-0 px-6 py-2 font-semibold rounded-lg"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center rounded-lg p-6">
              <h4>No featured rooms available</h4>
              <p className="mb-0">Please check back later for our latest accommodations.</p>
            </Alert>
          )}
        </Container>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 text-white">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="bg-white/10 backdrop-blur border-0 h-100 rounded-2xl">
                <Card.Body className="p-6 text-center">
                  <div className="text-4xl mb-4">🏨</div>
                  <h4 className="text-2xl font-bold mb-3">Browse All Rooms</h4>
                  <p className="mb-4 text-gray-300">
                    Explore our complete collection of luxury accommodations and find your perfect match.
                  </p>
                  <Button 
                    onClick={() => navigate('/rooms')}
                    className="btn-luxury border-0 px-6 py-3 font-semibold rounded-lg"
                  >
                    View All Rooms
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="bg-white/10 backdrop-blur border-0 h-100 rounded-2xl">
                <Card.Body className="p-6 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h4 className="text-2xl font-bold mb-3">Find Your Booking</h4>
                  <p className="mb-4 text-gray-300">
                    Already have a reservation? Look up your booking details using your confirmation code.
                  </p>
                  <Button 
                    onClick={() => navigate('/find-booking')}
                    variant="outline-light"
                    className="border-2 px-6 py-3 font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                  >
                    Find Booking
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;