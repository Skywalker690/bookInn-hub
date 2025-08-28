// User types
export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  bookings?: Booking[];
}

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  bookings?: BookingDTO[];
}

// Room types
export interface Room {
  id: number;
  roomType: string;
  roomPrice: number;
  roomPhotoUrl: string;
  roomDescription: string;
  bookings?: Booking[];
}

export interface RoomDTO {
  id: number;
  roomType: string;
  roomPrice: number;
  roomPhotoUrl: string;
  roomDescription: string;
  bookings?: BookingDTO[];
}

// Booking types
export interface Booking {
  id?: number;
  checkInDate: string;
  checkOutDate: string;
  numOfAdults: number;
  numOfChildren: number;
  totalNumOfGuest: number;
  bookingConfirmationCode?: string;
  user?: User;
  room?: Room;
}

export interface BookingDTO {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  numOfAdults: number;
  numOfChildren: number;
  totalNumOfGuest: number;
  bookingConfirmationCode: string;
  user?: UserDTO;
  room?: RoomDTO;
}

// API Response types
export interface ApiResponse {
  statusCode: number;
  message: string;
  role?: string;
  token?: string;
  expirationTime?: string;
  bookingConfirmationCode?: string;
  user?: UserDTO;
  room?: RoomDTO;
  booking?: BookingDTO;
  userList?: UserDTO[];
  roomList?: RoomDTO[];
  bookingList?: BookingDTO[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
  role?: string;
}

// Room search types
export interface RoomSearchParams {
  checkInDate?: string;
  checkOutDate?: string;
  roomType?: string;
}