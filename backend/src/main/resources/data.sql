-- ===============================
-- BookInn Hub - Database Seed Data
-- ===============================
-- This file populates the database with initial sample data for testing and development.
-- Spring Boot will automatically execute this file on application startup.

-- ===============================
-- Clear existing data (optional - comment out for production)
-- ===============================
-- DELETE FROM bookings;
-- DELETE FROM room;
-- DELETE FROM users;
-- TRUNCATE TABLE bookings, room, users RESTART IDENTITY CASCADE;

-- ===============================
-- Seed Users
-- ===============================
-- Password for all demo users: "password123"
-- BCrypt hash: $2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6

INSERT INTO users (name, email, password, phone_number, role) VALUES
('Demo User', 'demouser@gmail.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+1234567890', 'USER'),
('Admin User', 'admin@bookinn.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+0987654321', 'ADMIN'),
('John Doe', 'john.doe@example.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+1555123456', 'USER'),
('Jane Smith', 'jane.smith@example.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+1555987654', 'USER'),
('Hotel Manager', 'manager@bookinn.com', '$2a$10$8ZqvfG.fCvJvJqP3TvQFqO8JQxmxQZ8vY/YT7wJQZqLdVXvI9rTy6', '+1555246810', 'ADMIN');

-- ===============================
-- Seed Rooms
-- ===============================
INSERT INTO room (room_type, room_price, room_photo_url, room_description) VALUES
-- Standard Rooms
('Standard', 100.00, NULL, 'Comfortable room with basic amenities including queen-size bed, private bathroom, free Wi-Fi, flat-screen TV, and mini-fridge. Perfect for solo travelers or couples.'),
('Standard', 100.00, NULL, 'Cozy standard room featuring modern decor, comfortable bedding, workspace area, and all essential amenities for a pleasant stay.'),
('Standard', 100.00, NULL, 'Well-appointed standard room with city view, comfortable furnishings, and convenient access to hotel facilities.'),

-- Deluxe Rooms
('Deluxe', 150.00, NULL, 'Spacious deluxe room with premium amenities including king-size bed, luxury bathroom with bathtub, sitting area, work desk, complimentary refreshments, and stunning views.'),
('Deluxe', 150.00, NULL, 'Elegantly designed deluxe room offering extra space, upscale furnishings, premium bedding, coffee maker, and enhanced bathroom amenities.'),
('Deluxe', 150.00, NULL, 'Modern deluxe accommodation with panoramic windows, separate seating area, high-speed internet, and contemporary comfort.'),

-- Suite Rooms
('Suite', 250.00, NULL, 'Luxurious suite featuring separate living room and bedroom, premium king-size bed, sofa bed, dining area, kitchenette, two bathrooms, and exclusive concierge service.'),
('Suite', 250.00, NULL, 'Executive suite with spacious layout, elegant decor, premium entertainment system, mini-bar, workspace, and access to executive lounge.'),

-- Presidential Suite
('Presidential', 500.00, NULL, 'Top-tier presidential suite spanning 1500 sq ft with master bedroom, guest bedroom, grand living room, full kitchen, dining room for 8, luxury bathrooms with jacuzzi, private balcony, 24/7 butler service, and exclusive amenities.'),
('Presidential', 500.00, NULL, 'Ultimate luxury presidential suite featuring panoramic city views, state-of-the-art entertainment, designer furnishings, full bar, spa bathroom, and personalized concierge services.');

-- ===============================
-- Seed Bookings
-- ===============================
-- Note: Adjust dates as needed for testing
INSERT INTO bookings (check_in_date, check_out_date, num_of_adult, num_of_children, total_num_of_guest, booking_confirmation_code, user_id, room_id) VALUES
-- Active/Future Bookings
('2025-11-01', '2025-11-05', 2, 1, 3, 'MFST1FUDJZ', 1, 1),
('2025-11-10', '2025-11-15', 2, 0, 2, 'JR5K5NVT1G', 1, 4),
('2025-12-20', '2025-12-25', 4, 2, 6, 'OY3OJBOXR8', 3, 7),
('2025-11-15', '2025-11-18', 1, 0, 1, 'ABC123XYZ9', 4, 2),
('2025-12-01', '2025-12-07', 2, 2, 4, 'DEF456UVW8', 3, 5),

-- Past Bookings (for history)
('2024-08-01', '2024-08-05', 2, 1, 3, 'PAST1HIST1', 1, 3),
('2024-09-15', '2024-09-20', 2, 0, 2, 'PAST2HIST2', 4, 6);

-- ===============================
-- Verification Queries
-- ===============================
-- Uncomment to verify data after seeding:
-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as room_count FROM room;
-- SELECT COUNT(*) as booking_count FROM bookings;
-- SELECT room_type, COUNT(*) as count FROM room GROUP BY room_type ORDER BY count DESC;

-- ===============================
-- Notes
-- ===============================
-- 1. All demo users have the same password: "password123"
-- 2. Room photo URLs are NULL - update with actual S3 URLs after uploading images
-- 3. Booking dates should be adjusted based on current date for realistic testing
-- 4. Confirmation codes are unique and can be used to test the "Find Booking" feature
-- 5. This file runs automatically on application startup with spring.jpa.hibernate.ddl-auto=update
