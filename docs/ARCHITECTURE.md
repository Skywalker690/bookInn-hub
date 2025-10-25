# Architecture Documentation

## Overview

BookInn Hub is a full-stack hotel management and booking platform built using modern web technologies. The application follows a three-tier architecture pattern with clear separation between presentation, business logic, and data layers.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Components │ TypeScript │ React Router         │  │
│  │  Bootstrap & Tailwind CSS │ Axios                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕ HTTP/REST                        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Controllers (REST Endpoints)                         │  │
│  │         ↕                                             │  │
│  │  Services (Business Logic)                            │  │
│  │         ↕                                             │  │
│  │  Repositories (Data Access)                           │  │
│  │         ↕                                             │  │
│  │  Entities (JPA Models)                                │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Security (JWT + Spring Security)                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                    ↕                      ↕
        ┌───────────────────┐    ┌──────────────────┐
        │   PostgreSQL      │    │    AWS S3        │
        │   (NeonDB)        │    │  (Image Storage) │
        └───────────────────┘    └──────────────────┘
```

---

## Backend Architecture

### Technology Stack

- **Framework:** Spring Boot 3.5.3
- **Language:** Java 21
- **Build Tool:** Maven
- **ORM:** Spring Data JPA (Hibernate)
- **Database:** PostgreSQL
- **Security:** Spring Security + JWT
- **Cloud Storage:** AWS S3
- **Password Encryption:** BCrypt

### Layer Structure

#### 1. Controller Layer

**Location:** `src/main/java/com/sanjo/backend/controller/`

Controllers handle HTTP requests and responses. They are responsible for:
- Request validation
- Delegating business logic to services
- Returning appropriate HTTP responses

**Controllers:**
- `AuthController` - User authentication (login, register)
- `RoomController` - Room management operations
- `BookingController` - Booking operations
- `UserController` - User management

**Key Annotations:**
```java
@RestController
@RequestMapping("/endpoint")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE')")
```

#### 2. Service Layer

**Location:** `src/main/java/com/sanjo/backend/service/`

Services contain the business logic. They:
- Process data from controllers
- Interact with repositories
- Handle complex operations
- Implement business rules

**Structure:**
- `interfac/` - Service interfaces
- `implementation/` - Service implementations

**Services:**
- `UserService` - User management logic
- `RoomService` - Room management logic
- `BookingService` - Booking management logic
- `AwsS3Service` - AWS S3 integration

#### 3. Repository Layer

**Location:** `src/main/java/com/sanjo/backend/repository/`

Repositories handle database operations using Spring Data JPA:
- CRUD operations
- Custom queries
- Database transactions

**Repositories:**
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

#### 4. Entity Layer

**Location:** `src/main/java/com/sanjo/backend/entity/`

Entities represent database tables:
- `User` - User information and authentication
- `Room` - Room details and pricing
- `Booking` - Booking information

**Relationships:**
- User → Bookings (One-to-Many)
- Room → Bookings (One-to-Many)
- Booking → User (Many-to-One)
- Booking → Room (Many-to-One)

```java
@Entity
@Table(name = "room")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
```

#### 5. Security Layer

**Location:** `src/main/java/com/sanjo/backend/security/`

Security components:
- `SecurityConfig` - Spring Security configuration
- `JWTUtils` - JWT token generation and validation
- `JWTAuthFilter` - Request authentication filter
- `CustomUserDetailsService` - User authentication service
- `Utils` - Security utility functions

**Security Flow:**
1. User sends credentials to `/auth/login`
2. Backend validates credentials
3. JWT token generated and returned
4. Client includes token in subsequent requests
5. `JWTAuthFilter` validates token for each request

#### 6. DTO Layer

**Location:** `src/main/java/com/sanjo/backend/dto/`

Data Transfer Objects for API communication:
- `Response` - Standard API response wrapper
- `UserDTO` - User data transfer
- `RoomDTO` - Room data transfer
- `BookingDTO` - Booking data transfer
- `LoginRequest` - Login credentials

#### 7. Configuration

**Location:** `src/main/java/com/sanjo/backend/config/`

Configuration classes:
- `SecurityConfig` - Security and authentication setup
- `CorsConfig` - CORS policy configuration

---

## Frontend Architecture

### Technology Stack

- **Framework:** React 19.1.1
- **Language:** TypeScript 4.9.5
- **Build Tool:** Create React App with CRACO
- **Routing:** React Router DOM 7.8.2
- **HTTP Client:** Axios 1.11.0
- **UI Framework:** React Bootstrap 2.10.10 + Bootstrap 5.3.8
- **Styling:** Tailwind CSS 4.1.12
- **Testing:** Jest + React Testing Library

### Project Structure

```
frontend/src/
├── components/       # Reusable UI components
│   └── common/      # Shared components (Navbar, LoadingSpinner, etc.)
├── pages/           # Page components (routes)
├── services/        # API integration layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main application component
└── index.tsx        # Application entry point
```

### Component Structure

#### Pages

**Location:** `src/pages/`

Page components represent different routes:
- `Home.tsx` - Landing page
- `Rooms.tsx` - Browse rooms
- `RoomDetails.tsx` - View room details
- `BookingForm.tsx` - Book a room
- `FindBooking.tsx` - Search bookings
- `Login.tsx` - User login
- `Register.tsx` - User registration
- `Profile.tsx` - User profile and bookings
- `AdminDashboard.tsx` - Admin panel

#### Components

**Location:** `src/components/common/`

Reusable components:
- `Navbar.tsx` - Navigation bar
- `LoadingSpinner.tsx` - Loading indicator
- `ProtectedRoute.tsx` - Route authentication guard

#### Services

**Location:** `src/services/api.ts`

API integration using Axios:
- `authAPI` - Authentication operations
- `userAPI` - User management
- `roomAPI` - Room operations
- `bookingAPI` - Booking operations

**Features:**
- Automatic token injection
- Response/error interceptors
- Centralized API configuration

```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Types

**Location:** `src/types/index.ts`

TypeScript interfaces for type safety:
- API responses
- User, Room, Booking models
- Request/Response types

#### Utilities

**Location:** `src/utils/index.ts`

Helper functions:
- `AuthUtils` - Authentication helpers (login, logout, role checking)
- Local storage management
- Token validation

### Routing

React Router configuration in `App.tsx`:

```typescript
Routes:
  / - Home (public)
  /rooms - Browse rooms (public)
  /rooms/:id - Room details (public)
  /find-booking - Find booking (public)
  /login - Login (public, redirects if authenticated)
  /register - Register (public, redirects if authenticated)
  /profile - User profile (protected)
  /book/:roomId - Book room (protected)
  /admin/* - Admin dashboard (protected, admin only)
```

---

## Database Schema

### Tables

#### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL
);
```

#### Rooms Table
```sql
CREATE TABLE room (
    id BIGSERIAL PRIMARY KEY,
    room_type VARCHAR(100) NOT NULL,
    room_price DECIMAL(10,2) NOT NULL,
    room_photo_url TEXT,
    room_description TEXT
);
```

#### Bookings Table
```sql
CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_of_adults INT NOT NULL,
    num_of_children INT NOT NULL,
    total_num_of_guest INT NOT NULL,
    booking_confirmation_code VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    room_id BIGINT REFERENCES room(id)
);
```

---

## Security Architecture

### Authentication Flow

1. **Registration:**
   - User submits registration form
   - Password hashed with BCrypt
   - User stored in database with USER role

2. **Login:**
   - User submits credentials
   - Backend validates credentials
   - JWT token generated with user details and role
   - Token returned to client (valid for 7 days)

3. **Authorization:**
   - Client includes token in Authorization header
   - `JWTAuthFilter` intercepts requests
   - Token validated and user authenticated
   - Role-based access control enforced

### Role-Based Access Control

**Roles:**
- `USER` - Regular customers (can book rooms, view profile)
- `ADMIN` - Hotel managers (full access to all operations)

**Access Patterns:**
```java
@PreAuthorize("hasAuthority('ADMIN')")          // Admin only
@PreAuthorize("hasAuthority('USER')")           // User only
@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')") // Both
```

### Password Security

- Passwords hashed using BCrypt
- Salt automatically generated per password
- Never stored or transmitted in plain text

---

## Cloud Services Integration

### AWS S3

**Purpose:** Store and serve room images

**Implementation:**
- `AwsS3Service` handles S3 operations
- Upload images during room creation/update
- Return public URLs for frontend display
- Delete images when rooms are removed

**Configuration:**
```properties
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
BUCKET_NAME=your_bucket_name
```

### NeonDB PostgreSQL

**Purpose:** Production database

**Features:**
- Fully managed PostgreSQL
- Automatic backups
- Connection pooling
- SSL connections

---

## Deployment Architecture

### Frontend (Vercel)

- Automatic deployments from Git
- CDN distribution
- HTTPS enabled
- Environment variables configured

### Backend (Render)

- Container-based deployment
- Auto-scaling
- Health checks
- Cold start (~1 minute)

### Database (NeonDB)

- Managed PostgreSQL
- Automatic backups
- High availability

---

## API Communication

### Request/Response Flow

```
Frontend → API Request → Backend Controller
                    ↓
                Service Layer (Business Logic)
                    ↓
                Repository (Database Query)
                    ↓
                Database Response
                    ↓
                Service Processing
                    ↓
Frontend ← API Response ← Controller
```

### Response Format

All API responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "message": "Operation description",
  "data": { /* relevant data */ }
}
```

---

## Performance Considerations

### Backend Optimizations

- Lazy loading for entity relationships
- Connection pooling for database
- JWT stateless authentication (no server sessions)
- Efficient query design

### Frontend Optimizations

- Code splitting with React lazy loading
- Optimized images from S3
- Local storage for auth tokens
- Conditional rendering

---

## Error Handling

### Backend

- Global exception handler
- Custom `OurException` class
- Consistent error responses
- Proper HTTP status codes

### Frontend

- Axios interceptors for global error handling
- User-friendly error messages
- Automatic token refresh handling
- Network error recovery

---

## Future Enhancements

- Payment gateway integration
- Email notifications
- Advanced search filters
- Analytics dashboard
- Multi-language support
- Mobile applications
