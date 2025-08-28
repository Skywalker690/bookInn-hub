import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Badge
} from 'react-bootstrap';
import { bookingAPI } from '../services/api';
import { BookingDTO } from '../types';
import { CurrencyUtils, DateUtils, ValidationUtils } from '../utils';

const FindBooking: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ValidationUtils.isRequired(confirmationCode)) {
      setError('Please enter a confirmation code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setBooking(null);
      setSearched(true);

      const response = await bookingAPI.getBookingByConfirmationCode(confirmationCode);
      
      if (response.statusCode === 200 && response.booking) {
        setBooking(response.booking);
      } else {
        setError(response.message || 'Booking not found. Please check your confirmation code.');
      }
    } catch (err: any) {
      console.error('Find booking error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while searching for your booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await bookingAPI.cancelBooking(booking.id);
      
      if (response.statusCode === 200) {
        setBooking(null);
        setConfirmationCode('');
        setSearched(false);
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
      setLoading(false);
    }
  };

  const calculateNights = (checkInDate: string, checkOutDate: string): number => {
    return DateUtils.daysBetween(checkInDate, checkOutDate);
  };

  const calculateTotalPrice = (booking: BookingDTO): number => {
    if (!booking.room) return 0;
    return booking.room.roomPrice * calculateNights(booking.checkInDate, booking.checkOutDate);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h3>Find Your Booking</h3>
              <p className="mb-0 text-muted">
                Enter your confirmation code to view or manage your booking
              </p>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Booking Confirmation Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                        placeholder="Enter your confirmation code (e.g., ABC123XYZ)"
                        disabled={loading}
                        style={{ fontFamily: 'monospace' }}
                      />
                      <Form.Text className="text-muted">
                        You received this code when you made your booking
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || !confirmationCode.trim()}
                      className="w-100 mb-3"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Searching...
                        </>
                      ) : (
                        'Find Booking'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {/* Search Results */}
              {searched && !loading && !booking && !error && (
                <Alert variant="info">
                  <h5>No Booking Found</h5>
                  <p>
                    We couldn't find a booking with that confirmation code. 
                    Please check the code and try again.
                  </p>
                </Alert>
              )}

              {/* Booking Details */}
              {booking && (
                <div className="mt-4">
                  <Alert variant="success">
                    <h5>Booking Found!</h5>
                    <p className="mb-0">Your booking details are displayed below.</p>
                  </Alert>

                  <Card className="mt-3">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Booking Details</h5>
                      <Badge bg="primary">
                        Confirmation: {booking.bookingConfirmationCode}
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {/* Guest Information */}
                        <Col md={6}>
                          <h6>Guest Information</h6>
                          {booking.user && (
                            <div className="mb-3">
                              <p className="mb-1"><strong>Name:</strong> {booking.user.name}</p>
                              <p className="mb-1"><strong>Email:</strong> {booking.user.email}</p>
                              <p className="mb-0"><strong>Phone:</strong> {booking.user.phoneNumber}</p>
                            </div>
                          )}

                          <h6>Stay Details</h6>
                          <div className="mb-3">
                            <p className="mb-1">
                              <strong>Check-in:</strong> {booking.checkInDate}
                            </p>
                            <p className="mb-1">
                              <strong>Check-out:</strong> {booking.checkOutDate}
                            </p>
                            <p className="mb-1">
                              <strong>Nights:</strong> {calculateNights(booking.checkInDate, booking.checkOutDate)}
                            </p>
                            <p className="mb-1">
                              <strong>Adults:</strong> {booking.numOfAdults}
                            </p>
                            <p className="mb-1">
                              <strong>Children:</strong> {booking.numOfChildren}
                            </p>
                            <p className="mb-0">
                              <strong>Total Guests:</strong> {booking.totalNumOfGuest}
                            </p>
                          </div>
                        </Col>

                        {/* Room Information */}
                        <Col md={6}>
                          {booking.room && (
                            <>
                              <h6>Room Information</h6>
                              <div className="mb-3">
                                <p className="mb-1">
                                  <strong>Room Type:</strong> {booking.room.roomType}
                                </p>
                                <p className="mb-1">
                                  <strong>Room Number:</strong> #{booking.room.id}
                                </p>
                                <p className="mb-1">
                                  <strong>Price per Night:</strong> {CurrencyUtils.formatPrice(booking.room.roomPrice)}
                                </p>
                                <p className="mb-0">
                                  <strong>Total Amount:</strong>{' '}
                                  <span className="text-primary h6">
                                    {CurrencyUtils.formatPrice(calculateTotalPrice(booking))}
                                  </span>
                                </p>
                              </div>

                              {booking.room.roomPhotoUrl && (
                                <div>
                                  <h6>Room Image</h6>
                                  <img 
                                    src={booking.room.roomPhotoUrl} 
                                    alt={booking.room.roomType}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </Col>
                      </Row>

                      {/* Action Buttons */}
                      <hr />
                      <div className="d-flex gap-2">
                        <Button 
                          variant="danger" 
                          onClick={handleCancelBooking}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Cancelling...
                            </>
                          ) : (
                            'Cancel Booking'
                          )}
                        </Button>
                        <Button 
                          variant="outline-primary"
                          onClick={() => window.print()}
                        >
                          Print Details
                        </Button>
                      </div>

                      <Alert variant="warning" className="mt-3 mb-0">
                        <small>
                          <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before check-in. 
                          Late cancellations may incur charges.
                        </small>
                      </Alert>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Help Section */}
          <Card className="mt-4">
            <Card.Body>
              <h6>Need Help?</h6>
              <p className="mb-2">
                If you're having trouble finding your booking:
              </p>
              <ul className="mb-3">
                <li>Check your email for the confirmation message</li>
                <li>Make sure you're entering the complete confirmation code</li>
                <li>Contact customer service if you still can't find your booking</li>
              </ul>
              <Button variant="outline-secondary" size="sm">
                Contact Support
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FindBooking;