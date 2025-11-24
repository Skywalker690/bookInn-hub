export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
  bookings?: BookingDTO[];
}

export interface RoomDTO {
  id: number;
  roomType: string;
  roomPrice: number;
  roomPhotoUrl: string;
  roomDescription: string;
  bookings?: BookingDTO[];
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

export interface AuthResponse {
  statusCode: number;
  message: string;
  token?: string;
  role?: 'USER' | 'ADMIN';
  expirationTime?: string;
  bookingConfirmationCode?: string;
  user?: UserDTO;
  room?: RoomDTO;
  booking?: BookingDTO;
  userList?: UserDTO[];
  roomList?: RoomDTO[];
  bookingList?: BookingDTO[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}
