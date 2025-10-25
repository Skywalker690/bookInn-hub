# API Documentation

## Overview

BookInn Hub provides a RESTful API for hotel management and booking operations. The API is built with Spring Boot and follows REST principles.

**Base URL (Production):** `https://bookinn-hub.onrender.com`  
**Base URL (Local):** `http://localhost:8080`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Obtaining a Token

1. Register a new user or login with existing credentials
2. The login response will include a JWT token
3. Include this token in subsequent requests

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "USER"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request data
- `409` - Email already exists

---

### Login

Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "USER",
  "expirationTime": "7 Days",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "USER"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Invalid request data

---

## Room Endpoints

### Get All Rooms

Retrieve all rooms in the system.

**Endpoint:** `GET /rooms/all`

**Authentication:** Not required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Rooms retrieved successfully",
  "roomList": [
    {
      "id": 1,
      "roomType": "Deluxe",
      "roomPrice": 150.00,
      "roomPhotoUrl": "https://s3.amazonaws.com/...",
      "roomDescription": "Spacious room with ocean view",
      "bookings": []
    }
  ]
}
```

---

### Get All Available Rooms

Retrieve all rooms that are currently available for booking.

**Endpoint:** `GET /rooms/all-available-rooms`

**Authentication:** Not required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Available rooms retrieved successfully",
  "roomList": [...]
}
```

---

### Get Available Rooms by Date and Type

Filter rooms by availability dates and room type.

**Endpoint:** `GET /rooms/available-rooms-by-date-and-type`

**Authentication:** Not required

**Query Parameters:**
- `checkInDate` (required) - Format: YYYY-MM-DD
- `checkOutDate` (required) - Format: YYYY-MM-DD
- `roomType` (required) - Room type (e.g., "Deluxe", "Standard")

**Example Request:**
```
GET /rooms/available-rooms-by-date-and-type?checkInDate=2025-11-01&checkOutDate=2025-11-05&roomType=Deluxe
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Available rooms retrieved successfully",
  "roomList": [...]
}
```

---

### Get Room Types

Get a list of all available room types.

**Endpoint:** `GET /rooms/types`

**Authentication:** Not required

**Response:**
```json
["Standard", "Deluxe", "Suite", "Presidential"]
```

---

### Get Room by ID

Retrieve details of a specific room.

**Endpoint:** `GET /rooms/room-by-id/{roomId}`

**Authentication:** Not required

**Path Parameters:**
- `roomId` - Room ID

**Response:**
```json
{
  "statusCode": 200,
  "message": "Room retrieved successfully",
  "room": {
    "id": 1,
    "roomType": "Deluxe",
    "roomPrice": 150.00,
    "roomPhotoUrl": "https://s3.amazonaws.com/...",
    "roomDescription": "Spacious room with ocean view",
    "bookings": [...]
  }
}
```

---

### Add New Room (Admin Only)

Create a new room in the system.

**Endpoint:** `POST /rooms/add`

**Authentication:** Required (ADMIN role)

**Request:** multipart/form-data
- `photo` (file) - Room image
- `roomType` (string) - Type of room
- `roomPrice` (decimal) - Price per night
- `roomDescription` (string) - Room description

**Response:**
```json
{
  "statusCode": 200,
  "message": "Room added successfully",
  "room": {...}
}
```

---

### Update Room (Admin Only)

Update an existing room's details.

**Endpoint:** `PUT /rooms/update/{roomId}`

**Authentication:** Required (ADMIN role)

**Path Parameters:**
- `roomId` - Room ID

**Request:** multipart/form-data (all fields optional)
- `photo` (file) - New room image
- `roomType` (string) - New room type
- `roomPrice` (decimal) - New price
- `roomDescription` (string) - New description

**Response:**
```json
{
  "statusCode": 200,
  "message": "Room updated successfully",
  "room": {...}
}
```

---

### Delete Room (Admin Only)

Delete a room from the system.

**Endpoint:** `DELETE /rooms/delete/{roomId}`

**Authentication:** Required (ADMIN role)

**Path Parameters:**
- `roomId` - Room ID

**Response:**
```json
{
  "statusCode": 200,
  "message": "Room deleted successfully"
}
```

---

## Booking Endpoints

### Book a Room

Create a new booking for a room.

**Endpoint:** `POST /bookings/book-room/{roomId}/{userId}`

**Authentication:** Required (USER or ADMIN role)

**Path Parameters:**
- `roomId` - Room ID
- `userId` - User ID

**Request Body:**
```json
{
  "checkInDate": "2025-11-01",
  "checkOutDate": "2025-11-05",
  "numOfAdults": 2,
  "numOfChildren": 1
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Booking successful",
  "bookingConfirmationCode": "MFST1FUDJZ",
  "booking": {
    "id": 1,
    "checkInDate": "2025-11-01",
    "checkOutDate": "2025-11-05",
    "numOfAdults": 2,
    "numOfChildren": 1,
    "totalNumOfGuest": 3,
    "bookingConfirmationCode": "MFST1FUDJZ"
  }
}
```

---

### Get All Bookings (Admin Only)

Retrieve all bookings in the system.

**Endpoint:** `GET /bookings/all`

**Authentication:** Required (ADMIN role)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Bookings retrieved successfully",
  "bookingList": [...]
}
```

---

### Get Booking by Confirmation Code

Retrieve a booking using its confirmation code.

**Endpoint:** `GET /bookings/get-by-confirmation-code/{confirmationCode}`

**Authentication:** Not required

**Path Parameters:**
- `confirmationCode` - Booking confirmation code

**Response:**
```json
{
  "statusCode": 200,
  "message": "Booking retrieved successfully",
  "booking": {
    "id": 1,
    "checkInDate": "2025-11-01",
    "checkOutDate": "2025-11-05",
    "bookingConfirmationCode": "MFST1FUDJZ",
    "room": {...},
    "user": {...}
  }
}
```

---

### Cancel Booking

Cancel an existing booking.

**Endpoint:** `DELETE /bookings/cancel/{bookingId}`

**Authentication:** Required (USER or ADMIN role)

**Path Parameters:**
- `bookingId` - Booking ID

**Response:**
```json
{
  "statusCode": 200,
  "message": "Booking cancelled successfully"
}
```

---

## User Endpoints

### Get All Users (Admin Only)

Retrieve all users in the system.

**Endpoint:** `GET /users/all`

**Authentication:** Required (ADMIN role)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "userList": [...]
}
```

---

### Get User by ID (Admin Only)

Retrieve details of a specific user.

**Endpoint:** `GET /users/get-by-id/{userId}`

**Authentication:** Required (ADMIN role)

**Path Parameters:**
- `userId` - User ID

**Response:**
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "USER"
  }
}
```

---

### Get Logged-in User Profile

Get the profile of the currently authenticated user.

**Endpoint:** `GET /users/get-logged-in-profile-info`

**Authentication:** Required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "user": {...}
}
```

---

### Get User Booking History

Retrieve booking history for a specific user.

**Endpoint:** `GET /users/get-user-booking/{userId}`

**Authentication:** Required

**Path Parameters:**
- `userId` - User ID

**Response:**
```json
{
  "statusCode": 200,
  "message": "Booking history retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "bookings": [...]
  }
}
```

---

### Delete User (Admin Only)

Remove a user from the system.

**Endpoint:** `DELETE /users/delete/{userId}`

**Authentication:** Required (ADMIN role)

**Path Parameters:**
- `userId` - User ID

**Response:**
```json
{
  "statusCode": 200,
  "message": "User deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "statusCode": 400,
  "message": "Error description here"
}
```

### Common Status Codes

- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (authentication required or failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there are no rate limits imposed on the API. However, this may change in future versions.

---

## CORS Policy

The API supports CORS for the frontend application. Allowed origins are configured in the backend.
