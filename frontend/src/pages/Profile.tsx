import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userAPI, bookingAPI } from '../services/api';
import { UserDTO, BookingDTO } from '../types';
import { AuthUtils, CurrencyUtils, DateUtils } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);

  const currentUser = AuthUtils.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      const [profileResponse, bookingsResponse] = await Promise.all([
        userAPI.getLoggedInUserProfile(),
        userAPI.getUserBookingHistory(currentUser.id.toString())
      ]);

      if (profileResponse.statusCode === 200 && profileResponse.user) {
        setUser(profileResponse.user);
      }

      if (bookingsResponse.statusCode === 200) {
        setBookings(bookingsResponse.bookingList || []);
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelling(bookingId);
      const response = await bookingAPI.cancelBooking(bookingId);
      
      if (response.statusCode === 200) {
        // Remove cancelled booking from state
        setBookings(bookings.filter(b => b.id !== bookingId));
        alert('Booking cancelled successfully!');
      } else {
        setError(response.message || 'Failed to cancel booking. Please try again.');
      }
    } catch (err: any) {
      console.error('Cancel booking error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while cancelling your booking. Please try again.'
      );
    } finally {
      setCancelling(null);
    }
  };

  const calculateNights = (checkInDate: string, checkOutDate: string): number => {
    return DateUtils.daysBetween(checkInDate, checkOutDate);
  };

  const calculateTotalPrice = (booking: BookingDTO): number => {
    if (!booking.room) return 0;
    return booking.room.roomPrice * calculateNights(booking.checkInDate, booking.checkOutDate);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (!user) {
    return (
      <Container>
        <Alert variant="danger">
          <h4>Profile Not Found</h4>
          <p>Unable to load your profile. Please try logging in again.</p>
          <Button variant="outline-danger" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        {/* User Profile Info */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {user.phoneNumber}
              </div>
              <div className="mb-3">
                <strong>Role:</strong>{' '}
                <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'}>
                  {user.role}
                </Badge>
              </div>
              
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => navigate('/rooms')}>
                  Browse Rooms
                </Button>
                {user.role === 'ADMIN' && (
                  <Button variant="outline-success" onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">Booking Statistics</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Bookings:</span>
                <Badge bg="info">{bookings.length}</Badge>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Spent:</span>
                <Badge bg="success">
                  {CurrencyUtils.formatPrice(
                    bookings.reduce((total, booking) => total + calculateTotalPrice(booking), 0)
                  )}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Booking History */}
        <Col lg={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Booking History</h5>
              <Button variant="primary" size="sm" onClick={() => navigate('/rooms')}>
                New Booking
              </Button>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {bookings.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Confirmation Code</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>
                            <code>{booking.bookingConfirmationCode}</code>
                          </td>
                          <td>
                            {booking.room ? (
                              <div>
                                <div><strong>{booking.room.roomType}</strong></div>
                                <small className="text-muted">Room #{booking.room.id}</small>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>
                            <div>
                              <div>{booking.checkInDate}</div>
                              <div>{booking.checkOutDate}</div>
                              <small className="text-muted">
                                {calculateNights(booking.checkInDate, booking.checkOutDate)} nights
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>Adults: {booking.numOfAdults}</div>
                              <div>Children: {booking.numOfChildren}</div>
                            </div>
                          </td>
                          <td>
                            <strong className="text-primary">
                              {CurrencyUtils.formatPrice(calculateTotalPrice(booking))}
                            </strong>
                          </td>
                          <td>
                            <div className="d-grid gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate(`/find-booking`)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancelling === booking.id}
                              >
                                {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info">
                  <h6>No Bookings Yet</h6>
                  <p>You haven't made any bookings yet. Browse our available rooms to make your first reservation!</p>
                  <Button variant="primary" onClick={() => navigate('/rooms')}>
                    Browse Rooms
                  </Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;