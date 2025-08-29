import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table,
  Nav,
  Modal,
  Form
} from 'react-bootstrap';
import { userAPI, roomAPI, bookingAPI } from '../services/api';
import { UserDTO, RoomDTO, BookingDTO } from '../types';
import { CurrencyUtils } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  
  // Add room form state
  const [newRoom, setNewRoom] = useState({
    roomType: '',
    roomPrice: '',
    roomDescription: '',
    roomPhoto: null as File | null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersResponse, roomsResponse, bookingsResponse] = await Promise.all([
        userAPI.getAllUsers(),
        roomAPI.getAllRooms(),
        bookingAPI.getAllBookings()
      ]);

      if (usersResponse.statusCode === 200) {
        setUsers(usersResponse.userList || []);
      }

      if (roomsResponse.statusCode === 200) {
        setRooms(roomsResponse.roomList || []);
      }

      if (bookingsResponse.statusCode === 200) {
        setBookings(bookingsResponse.bookingList || []);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await userAPI.deleteUser(userId.toString());
      if (response.statusCode === 200) {
        setUsers(users.filter(u => u.id !== userId));
        alert('User deleted successfully!');
      } else {
        setError(response.message || 'Failed to delete user.');
      }
    } catch (err: any) {
      console.error('Delete user error:', err);
      setError('An error occurred while deleting the user.');
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await roomAPI.deleteRoom(roomId);
      if (response.statusCode === 200) {
        setRooms(rooms.filter(r => r.id !== roomId));
        alert('Room deleted successfully!');
      } else {
        setError(response.message || 'Failed to delete room.');
      }
    } catch (err: any) {
      console.error('Delete room error:', err);
      setError('An error occurred while deleting the room.');
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRoom.roomType || !newRoom.roomPrice || !newRoom.roomDescription) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!newRoom.roomPhoto) {
      setError('Please select a room photo.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('roomType', newRoom.roomType);
      formData.append('roomPrice', newRoom.roomPrice);
      formData.append('roomDescription', newRoom.roomDescription);
      formData.append('photo', newRoom.roomPhoto);

      const response = await roomAPI.addRoom(formData);
      
      if (response.statusCode === 200) {
        alert('Room added successfully!');
        setShowAddRoomModal(false);
        setNewRoom({
          roomType: '',
          roomPrice: '',
          roomDescription: '',
          roomPhoto: null
        });
        // Refresh the rooms list
        fetchDashboardData();
      } else {
        setError(response.message || 'Failed to add room.');
      }
    } catch (err: any) {
      console.error('Add room error:', err);
      setError('An error occurred while adding the room.');
    }
  };

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewRoom(prev => ({
        ...prev,
        roomPhoto: e.target.files![0]
      }));
    }
  };

  const calculateTotalRevenue = (): number => {
    return bookings.reduce((total, booking) => {
      if (booking.room) {
        const nights = Math.ceil(
          (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
        );
        return total + (booking.room.roomPrice * nights);
      }
      return total;
    }, 0);
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <Container>
      <h1 className="mb-4">Admin Dashboard</h1>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'rooms'} 
            onClick={() => setActiveTab('rooms')}
          >
            Rooms ({rooms.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'bookings'} 
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Row>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-primary">{users.length}</h2>
                <p>Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-success">{rooms.length}</h2>
                <p>Total Rooms</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-warning">{bookings.length}</h2>
                <p>Total Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-info">{CurrencyUtils.formatPrice(calculateTotalRevenue())}</h2>
                <p>Total Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <Card.Header>
            <h5>User Management</h5>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      {user.role !== 'ADMIN' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>Room Management</h5>
            <Button variant="primary" onClick={() => setShowAddRoomModal(true)}>
              Add New Room
            </Button>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.roomType}</td>
                    <td>{CurrencyUtils.formatPrice(room.roomPrice)}</td>
                    <td>{room.roomDescription?.substring(0, 50)}...</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <Card>
          <Card.Header>
            <h5>Booking Management</h5>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Confirmation Code</th>
                  <th>User</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td><code>{booking.bookingConfirmationCode}</code></td>
                    <td>{booking.user?.name || 'N/A'}</td>
                    <td>{booking.room?.roomType || 'N/A'}</td>
                    <td>
                      <div>
                        <div>{booking.checkInDate}</div>
                        <div>{booking.checkOutDate}</div>
                      </div>
                    </td>
                    <td>{booking.totalNumOfGuest}</td>
                    <td>
                      {booking.room && (
                        <strong>
                          {CurrencyUtils.formatPrice(
                            booking.room.roomPrice * 
                            Math.ceil(
                              (new Date(booking.checkOutDate).getTime() - 
                               new Date(booking.checkInDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                            )
                          )}
                        </strong>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      
      {/* Add Room Modal */}
      <Modal show={showAddRoomModal} onHide={() => setShowAddRoomModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddRoom}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Type *</Form.Label>
                  <Form.Control
                    type="text"
                    name="roomType"
                    value={newRoom.roomType}
                    onChange={handleRoomInputChange}
                    placeholder="Enter room type (e.g., Standard, Deluxe, Suite)"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Price per Night ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="roomPrice"
                    value={newRoom.roomPrice}
                    onChange={handleRoomInputChange}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Room Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="roomDescription"
                value={newRoom.roomDescription}
                onChange={handleRoomInputChange}
                placeholder="Enter room description"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Room Photo *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <Form.Text className="text-muted">
                Please select an image file (JPG, PNG, etc.)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddRoomModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Room
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;