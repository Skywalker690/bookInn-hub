import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../services/api';
import { RoomDTO, Booking } from '../types';
import { DateUtils, CurrencyUtils, AuthUtils } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingForm: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = AuthUtils.getCurrentUser();

  const [bookingData, setBookingData] = useState<Booking>({
    checkInDate: DateUtils.getTodayString(),
    checkOutDate: DateUtils.getTomorrowString(),
    numOfAdults: 1,
    numOfChildren: 0,
    totalNumOfGuest: 1
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Booking, string>>>({});

  const fetchRoomDetails = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      const response = await roomAPI.getRoomById(parseInt(roomId));
      
      if (response.statusCode === 200 && response.room) {
        setRoom(response.room);
      } else {
        setError(response.message || 'Room not found');
      }
    } catch (err: any) {
      console.error('Error fetching room details:', err);
      setError('Failed to load room details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId, fetchRoomDetails]);

  useEffect(() => {
    // Update total guests when adults or children change
    setBookingData(prev => ({
      ...prev,
      totalNumOfGuest: prev.numOfAdults + prev.numOfChildren
    }));
  }, [bookingData.numOfAdults, bookingData.numOfChildren]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof Booking, string>> = {};

    if (!DateUtils.isValidDate(bookingData.checkInDate)) {
      errors.checkInDate = 'Please select a valid check-in date';
    } else if (new Date(bookingData.checkInDate) < new Date(DateUtils.getTodayString())) {
      errors.checkInDate = 'Check-in date cannot be in the past';
    }

    if (!DateUtils.isValidDate(bookingData.checkOutDate)) {
      errors.checkOutDate = 'Please select a valid check-out date';
    } else if (new Date(bookingData.checkOutDate) <= new Date(bookingData.checkInDate)) {
      errors.checkOutDate = 'Check-out date must be after check-in date';
    }

    if (bookingData.numOfAdults < 1) {
      errors.numOfAdults = 'At least one adult is required';
    }

    if (bookingData.numOfChildren < 0) {
      errors.numOfChildren = 'Number of children cannot be negative';
    }

    if (bookingData.totalNumOfGuest > 4) {
      errors.totalNumOfGuest = 'Maximum 4 guests per room';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseInt(value) || 0 : value;
    
    setBookingData(prev => ({ ...prev, [name]: parsedValue }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof Booking]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !room || !currentUser) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const response = await bookingAPI.bookRoom(
        room.id,
        currentUser.id,
        bookingData
      );

      if (response.statusCode === 200) {
        setSuccess(
          `Booking confirmed! Your confirmation code is: ${response.bookingConfirmationCode}`
        );
        
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        setError(response.message || 'Booking failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while processing your booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const calculateNights = (): number => {
    return DateUtils.daysBetween(bookingData.checkInDate, bookingData.checkOutDate);
  };

  const calculateTotalPrice = (): number => {
    if (!room) return 0;
    return room.roomPrice * calculateNights();
  };

  if (loading) {
    return <LoadingSpinner message="Loading booking form..." />;
  }

  if (error && !room) {
    return (
      <Container>
        <Alert variant="danger">
          <h4>Error Loading Room</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!room) {
    return (
      <Container>
        <Alert variant="warning">
          <h4>Room Not Found</h4>
          <p>The requested room could not be found.</p>
          <Button variant="outline-warning" onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        {/* Booking Form */}
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h3>Book Your Stay</h3>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  <h5>Booking Successful!</h5>
                  <p>{success}</p>
                  <p>You will be redirected to your profile shortly...</p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-in Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.checkInDate}
                        min={DateUtils.getTodayString()}
                        disabled={submitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.checkInDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-out Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.checkOutDate}
                        min={DateUtils.getTomorrowString()}
                        disabled={submitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.checkOutDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Adults</Form.Label>
                      <Form.Control
                        type="number"
                        name="numOfAdults"
                        value={bookingData.numOfAdults}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.numOfAdults}
                        min="1"
                        max="4"
                        disabled={submitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.numOfAdults}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Children</Form.Label>
                      <Form.Control
                        type="number"
                        name="numOfChildren"
                        value={bookingData.numOfChildren}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.numOfChildren}
                        min="0"
                        max="3"
                        disabled={submitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.numOfChildren}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Alert variant="info">
                  <strong>Total Guests:</strong> {bookingData.totalNumOfGuest}
                  {formErrors.totalNumOfGuest && (
                    <div className="text-danger mt-1">{formErrors.totalNumOfGuest}</div>
                  )}
                </Alert>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={submitting || !!success}
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Processing Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Booking Summary */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5>Booking Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>{room.roomType}</h6>
                <p className="text-muted mb-0">Room #{room.id}</p>
              </div>

              <hr />

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Check-in:</span>
                  <span>{bookingData.checkInDate || 'Not selected'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Check-out:</span>
                  <span>{bookingData.checkOutDate || 'Not selected'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Guests:</span>
                  <span>{bookingData.totalNumOfGuest}</span>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Price per night:</span>
                  <span>{CurrencyUtils.formatPrice(room.roomPrice)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Nights:</span>
                  <span>× {calculateNights()}</span>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-primary">
                  {CurrencyUtils.formatPrice(calculateTotalPrice())}
                </strong>
              </div>
            </Card.Body>
          </Card>

          <div className="mt-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="w-100"
            >
              ← Back to Room Details
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;