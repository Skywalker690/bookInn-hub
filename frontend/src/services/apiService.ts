import { REACT_APP_API_BASE_URL } from '../constants';
import { AuthResponse } from '../types';

export class ApiService {
  private static getHeaders(isMultipart = false) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  static async request(endpoint: string, method: string, body?: any, isMultipart = false): Promise<AuthResponse> {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}${endpoint}`, {
        method,
        headers: this.getHeaders(isMultipart),
        body: isMultipart ? body : (body ? JSON.stringify(body) : undefined),
      });

      const data = await response.json();
      
      if (data.statusCode && data.statusCode !== 200) {
        throw new Error(data.message || 'API Error');
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication
  static async register(data: any) {
    return this.request('/auth/register', 'POST', data);
  }

  static async login(data: any) {
    return this.request('/auth/login', 'POST', data);
  }

  // Rooms
  static async getAllRooms() {
    return this.request('/rooms/all', 'GET');
  }

  static async getRoomById(roomId: string) {
    return this.request(`/rooms/room-by-id/${roomId}`, 'GET');
  }

  static async getAvailableRoomsByDateAndType(checkInDate: string, checkOutDate: string, roomType: string) {
    // Handling case where params might be empty strings
    const params = new URLSearchParams();
    if (checkInDate) params.append('checkInDate', checkInDate);
    if (checkOutDate) params.append('checkOutDate', checkOutDate);
    if (roomType) params.append('roomType', roomType);
    
    return this.request(`/rooms/available-rooms-by-date-and-type?${params.toString()}`, 'GET');
  }

  static async getAllAvailableRooms() {
    return this.request('/rooms/all-available-rooms', 'GET');
  }

  static async addRoom(formData: FormData) {
    return this.request('/rooms/add', 'POST', formData, true);
  }

  static async updateRoom(roomId: number, formData: FormData) {
    return this.request(`/rooms/update/${roomId}`, 'PUT', formData, true);
  }

  static async deleteRoom(roomId: number) {
    return this.request(`/rooms/delete/${roomId}`, 'DELETE');
  }

  // Bookings
  static async bookRoom(roomId: number, userId: number, bookingData: any) {
    return this.request(`/bookings/book-room/${roomId}/${userId}`, 'POST', bookingData);
  }

  static async getAllBookings() {
    return this.request('/bookings/all', 'GET');
  }

  static async getUserBookings(userId: string) {
    return this.request(`/users/get-user-booking/${userId}`, 'GET');
  }

  static async cancelBooking(bookingId: number) {
    return this.request(`/bookings/cancel/${bookingId}`, 'DELETE');
  }
  
  static async getBookingByConfirmationCode(code: string) {
    return this.request(`/bookings/get-by-confirmation-code/${code}`, 'GET');
  }

  // Users
  static async getAllUsers() {
    return this.request('/users/all', 'GET');
  }

  static async deleteUser(userId: string) {
    return this.request(`/users/delete/${userId}`, 'DELETE');
  }

  static async getUserProfile() {
    return this.request('/users/get-logged-in-profile-info', 'GET');
  }
}
