# Database Schema Documentation

## Overview

BookInn Hub uses PostgreSQL as its relational database. The schema is designed to support hotel management, user authentication, and booking operations.

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
│─────────────────│
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ phone_number    │
│ role            │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│    Bookings     │
│─────────────────│
│ id (PK)         │
│ check_in_date   │
│ check_out_date  │
│ num_of_adults   │
│ num_of_children │
│ total_guests    │
│ confirmation    │
│ user_id (FK)    │
│ room_id (FK)    │
└────────┬────────┘
         │
         │ N:1
         │
┌────────▼────────┐
│      Rooms      │
│─────────────────│
│ id (PK)         │
│ room_type       │
│ room_price      │
│ room_photo_url  │
│ room_description│
└─────────────────┘
```

---

## Tables

### Users Table

Stores user account information and authentication details.

**Table Name:** `users`

| Column       | Type         | Constraints                  | Description                    |
|-------------|--------------|------------------------------|--------------------------------|
| id          | BIGSERIAL    | PRIMARY KEY                  | Unique user identifier         |
| name        | VARCHAR(255) | NOT NULL                     | User's full name               |
| email       | VARCHAR(255) | NOT NULL, UNIQUE             | User's email (login username)  |
| password    | VARCHAR(255) | NOT NULL                     | BCrypt hashed password         |
| phone_number| VARCHAR(20)  | NULL                         | Contact phone number           |
| role        | VARCHAR(50)  | NOT NULL                     | User role (USER or ADMIN)      |

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**SQL Definition:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Example Data:**
```sql
INSERT INTO users (name, email, password, phone_number, role) VALUES
('John Doe', 'john@example.com', '$2a$10$...hashed...', '+1234567890', 'USER'),
('Admin User', 'admin@bookinn.com', '$2a$10$...hashed...', '+0987654321', 'ADMIN');
```

**Notes:**
- Passwords are hashed using BCrypt with strength 10
- Default role is 'USER' upon registration
- Email must be unique across all users
- Phone number is optional

---

### Rooms Table

Stores hotel room information including type, pricing, and descriptions.

**Table Name:** `room`

| Column          | Type          | Constraints     | Description                    |
|----------------|---------------|-----------------|--------------------------------|
| id             | BIGSERIAL     | PRIMARY KEY     | Unique room identifier         |
| room_type      | VARCHAR(100)  | NOT NULL        | Type of room (e.g., Deluxe)    |
| room_price     | DECIMAL(10,2) | NOT NULL        | Price per night                |
| room_photo_url | TEXT          | NULL            | AWS S3 URL for room image      |
| room_description| TEXT         | NULL            | Detailed room description      |

**Indexes:**
- Primary key on `id`
- Index on `room_type` for filtering

**SQL Definition:**
```sql
CREATE TABLE room (
    id BIGSERIAL PRIMARY KEY,
    room_type VARCHAR(100) NOT NULL,
    room_price DECIMAL(10,2) NOT NULL CHECK (room_price > 0),
    room_photo_url TEXT,
    room_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_room_type ON room(room_type);
CREATE INDEX idx_room_price ON room(room_price);
```

**Example Data:**
```sql
INSERT INTO room (room_type, room_price, room_photo_url, room_description) VALUES
('Standard', 100.00, 'https://s3.amazonaws.com/bucket/standard.jpg', 'Comfortable room with basic amenities'),
('Deluxe', 150.00, 'https://s3.amazonaws.com/bucket/deluxe.jpg', 'Spacious room with premium amenities'),
('Suite', 250.00, 'https://s3.amazonaws.com/bucket/suite.jpg', 'Luxurious suite with separate living area'),
('Presidential', 500.00, 'https://s3.amazonaws.com/bucket/presidential.jpg', 'Top-tier suite with exclusive services');
```

**Notes:**
- Room types are not enforced by database constraints
- Price must be greater than 0
- Photo URL can be null if no image is uploaded
- Multiple rooms can have the same type

---

### Bookings Table

Stores hotel room booking information and links users to rooms.

**Table Name:** `booking`

| Column                   | Type      | Constraints                    | Description                          |
|-------------------------|-----------|--------------------------------|--------------------------------------|
| id                      | BIGSERIAL | PRIMARY KEY                    | Unique booking identifier            |
| check_in_date           | DATE      | NOT NULL                       | Booking check-in date                |
| check_out_date          | DATE      | NOT NULL                       | Booking check-out date               |
| num_of_adults           | INTEGER   | NOT NULL                       | Number of adult guests               |
| num_of_children         | INTEGER   | NOT NULL                       | Number of child guests               |
| total_num_of_guest      | INTEGER   | NOT NULL                       | Total number of guests               |
| booking_confirmation_code| VARCHAR(50)| NOT NULL, UNIQUE              | Unique confirmation code             |
| user_id                 | BIGINT    | FOREIGN KEY → users(id)        | Reference to user making booking     |
| room_id                 | BIGINT    | FOREIGN KEY → room(id)         | Reference to booked room             |

**Indexes:**
- Primary key on `id`
- Unique index on `booking_confirmation_code`
- Foreign key indexes on `user_id` and `room_id`
- Composite index on `check_in_date` and `check_out_date`

**SQL Definition:**
```sql
CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_of_adults INTEGER NOT NULL CHECK (num_of_adults > 0),
    num_of_children INTEGER NOT NULL CHECK (num_of_children >= 0),
    total_num_of_guest INTEGER NOT NULL CHECK (total_num_of_guest > 0),
    booking_confirmation_code VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE,
    CHECK (check_out_date > check_in_date)
);

CREATE INDEX idx_booking_confirmation ON booking(booking_confirmation_code);
CREATE INDEX idx_booking_user ON booking(user_id);
CREATE INDEX idx_booking_room ON booking(room_id);
CREATE INDEX idx_booking_dates ON booking(check_in_date, check_out_date);
```

**Example Data:**
```sql
INSERT INTO booking (
    check_in_date, check_out_date, num_of_adults, num_of_children, 
    total_num_of_guest, booking_confirmation_code, user_id, room_id
) VALUES
('2025-11-01', '2025-11-05', 2, 1, 3, 'MFST1FUDJZ', 1, 1),
('2025-11-10', '2025-11-15', 2, 0, 2, 'JR5K5NVT1G', 1, 2),
('2025-12-20', '2025-12-25', 4, 2, 6, 'OY3OJBOXR8', 2, 3);
```

**Notes:**
- Check-out date must be after check-in date
- Confirmation code is auto-generated (10 characters, alphanumeric)
- Total guests = adults + children
- Cascade delete: If user or room is deleted, bookings are also deleted
- At least one adult must be present

---

## Relationships

### User → Bookings (One-to-Many)

- One user can have multiple bookings
- Each booking belongs to exactly one user
- Foreign key: `booking.user_id` → `users.id`

**JPA Mapping:**
```java
@Entity
public class User {
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
```

### Room → Bookings (One-to-Many)

- One room can have multiple bookings (over time)
- Each booking is for exactly one room
- Foreign key: `booking.room_id` → `room.id`

**JPA Mapping:**
```java
@Entity
public class Room {
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
```

### Booking → User (Many-to-One)

**JPA Mapping:**
```java
@Entity
public class Booking {
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
}
```

### Booking → Room (Many-to-One)

**JPA Mapping:**
```java
@Entity
public class Booking {
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    private Room room;
}
```

---

## Queries

### Common Queries

#### Find User by Email
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

#### Get Available Rooms (not booked for specific dates)
```sql
SELECT r.* FROM room r
WHERE r.id NOT IN (
    SELECT DISTINCT b.room_id FROM booking b
    WHERE (b.check_in_date < '2025-11-05' AND b.check_out_date > '2025-11-01')
);
```

#### Get User's Booking History
```sql
SELECT b.*, r.room_type, r.room_price
FROM booking b
JOIN room r ON b.room_id = r.id
WHERE b.user_id = 1
ORDER BY b.check_in_date DESC;
```

#### Get All Bookings for a Room
```sql
SELECT b.*, u.name, u.email
FROM booking b
JOIN users u ON b.user_id = u.id
WHERE b.room_id = 1
ORDER BY b.check_in_date;
```

#### Find Booking by Confirmation Code
```sql
SELECT b.*, u.name, u.email, r.room_type
FROM booking b
JOIN users u ON b.user_id = u.id
JOIN room r ON b.room_id = r.id
WHERE b.booking_confirmation_code = 'MFST1FUDJZ';
```

#### Get Room Types and Count
```sql
SELECT room_type, COUNT(*) as count
FROM room
GROUP BY room_type
ORDER BY count DESC;
```

---

## Data Constraints

### Business Rules

1. **Email Uniqueness:** Each email can only be registered once
2. **Date Validation:** Check-out date must be after check-in date
3. **Guest Count:** At least one adult required per booking
4. **Price Validation:** Room price must be positive
5. **Confirmation Code:** Must be unique across all bookings

### Database Constraints

```sql
-- Email uniqueness
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Date validation
ALTER TABLE booking ADD CONSTRAINT valid_dates 
CHECK (check_out_date > check_in_date);

-- Guest validation
ALTER TABLE booking ADD CONSTRAINT min_adults 
CHECK (num_of_adults > 0);

ALTER TABLE booking ADD CONSTRAINT min_children 
CHECK (num_of_children >= 0);

-- Price validation
ALTER TABLE room ADD CONSTRAINT positive_price 
CHECK (room_price > 0);
```

---

## Indexes Strategy

### Performance Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Rooms
CREATE INDEX idx_room_type ON room(room_type);
CREATE INDEX idx_room_price ON room(room_price);

-- Bookings
CREATE INDEX idx_booking_dates ON booking(check_in_date, check_out_date);
CREATE INDEX idx_booking_user ON booking(user_id);
CREATE INDEX idx_booking_room ON booking(room_id);
CREATE INDEX idx_booking_confirmation ON booking(booking_confirmation_code);
```

---

## Migration Strategy

### Initial Setup

Spring Boot JPA automatically creates tables on first run based on entity annotations.

### Schema Updates

For production, use migration tools like:
- Flyway
- Liquibase

**Example Flyway Migration:**
```sql
-- V1__Initial_Schema.sql
CREATE TABLE users (...);
CREATE TABLE room (...);
CREATE TABLE booking (...);

-- V2__Add_Timestamps.sql
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

---

## Backup and Recovery

### Backup

```bash
# Full database backup
pg_dump -h hostname -U username -d bookinn_db > backup.sql

# Table-specific backup
pg_dump -h hostname -U username -t users -d bookinn_db > users_backup.sql
```

### Restore

```bash
# Restore full database
psql -h hostname -U username -d bookinn_db < backup.sql

# Restore specific table
psql -h hostname -U username -d bookinn_db < users_backup.sql
```

---

## Data Seeding

### Automatic Seeding with data.sql

The project includes a `data.sql` file at `backend/src/main/resources/data.sql` that automatically populates the database with sample data on application startup.

**Location:** `backend/src/main/resources/data.sql`

**Features:**
- Pre-configured demo users (USER and ADMIN roles)
- Sample rooms (Standard, Deluxe, Suite, Presidential)
- Example bookings for testing
- All passwords are BCrypt hashed (default: "password123")

**Configuration:**
```properties
# application.properties
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

**Demo Credentials:**
- Email: `demouser@gmail.com` | Password: `password123` | Role: USER
- Email: `admin@bookinn.com` | Password: `password123` | Role: ADMIN

**Sample Booking Codes:**
- `MFST1FUDJZ`
- `JR5K5NVT1G`
- `OY3OJBOXR8`

### Manual Seed Script

If you need to manually seed the database:

```bash
# Using psql
psql -h hostname -U username -d bookinn_db < backend/src/main/resources/data.sql

# Or connect and run manually
psql -h hostname -U username -d bookinn_db
\i backend/src/main/resources/data.sql
```

### Seed Data Contents

```sql
-- Seed users (password: password123)
INSERT INTO users (name, email, password, phone_number, role) VALUES
('Demo User', 'demouser@gmail.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+1234567890', 'USER'),
('Admin User', 'admin@bookinn.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+0987654321', 'ADMIN');

-- Seed rooms
INSERT INTO room (room_type, room_price, room_photo_url, room_description) VALUES
('Standard', 100.00, NULL, 'Comfortable room with basic amenities'),
('Deluxe', 150.00, NULL, 'Spacious room with premium amenities'),
('Suite', 250.00, NULL, 'Luxurious suite with separate living area'),
('Presidential', 500.00, NULL, 'Top-tier suite with exclusive services');

-- Seed bookings
INSERT INTO bookings (
    check_in_date, check_out_date, num_of_adult, num_of_children,
    total_num_of_guest, booking_confirmation_code, user_id, room_id
) VALUES
('2025-11-01', '2025-11-05', 2, 1, 3, 'MFST1FUDJZ', 1, 1),
('2025-11-10', '2025-11-15', 2, 0, 2, 'JR5K5NVT1G', 1, 4);
```

**Note:** See the full `data.sql` file for complete seed data including additional users, rooms, and bookings.

---

## Security Considerations

1. **Password Storage:** Always hash passwords (BCrypt, Argon2)
2. **SQL Injection:** Use prepared statements (JPA handles this)
3. **Access Control:** Implement proper authorization at application layer
4. **Data Encryption:** Use SSL/TLS for database connections
5. **Sensitive Data:** Consider encrypting phone numbers and other PII

---

## Performance Optimization

### Query Optimization

1. Use appropriate indexes
2. Avoid N+1 query problems (use JPA fetch strategies)
3. Use pagination for large result sets
4. Cache frequently accessed data

### Connection Pooling

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
```

---

## Monitoring

### Key Metrics to Monitor

1. Connection pool usage
2. Slow queries (queries taking > 1 second)
3. Table sizes
4. Index usage
5. Lock contention

### Useful Queries

```sql
-- Check table sizes
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## Future Enhancements

Potential schema improvements:

1. **Reviews Table** - Store user reviews for rooms
2. **Amenities Table** - Track room amenities separately
3. **Payments Table** - Store payment transaction details
4. **Notifications Table** - Store email/SMS notifications
5. **Audit Log** - Track all changes to critical data

---

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)
