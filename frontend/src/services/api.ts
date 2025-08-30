import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  Booking,
  RoomSearchParams 
} from '../types';

const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
    ? "http://localhost:8080"
    : "https://bookinn-hub.onrender.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/register', userData);
    return response.data;
  },
};

// User API calls
export const userAPI = {
  getAllUsers: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/users/all');
    return response.data;
  },

  getUserById: async (userId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(`/users/get-by-id/${userId}`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/users/get-by-id/${userId}`);
    return response.data;
  },

  getLoggedInUserProfile: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/users/get-logged-in-profile-info');
    return response.data;
  },

  getUserBookingHistory: async (userId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(`/users/get-user-booking/${userId}`);
    return response.data;
  },
};

// Room API calls
export const roomAPI = {
  getAllRooms: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/rooms/all');
    return response.data;
  },

  getRoomTypes: async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await api.get('/rooms/types');
    return response.data;
  },

  getRoomById: async (roomId: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(`/rooms/room-by-id/${roomId}`);
    return response.data;
  },

  getAllAvailableRooms: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/rooms/all-available-rooms');
    return response.data;
  },

  getAvailableRoomsByDateAndType: async (params: RoomSearchParams): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params.checkInDate) queryParams.append('checkInDate', params.checkInDate);
    if (params.checkOutDate) queryParams.append('checkOutDate', params.checkOutDate);
    if (params.roomType) queryParams.append('roomType', params.roomType);
    
    const response: AxiosResponse<ApiResponse> = await api.get(
      `/rooms/available-rooms-by-date-and-type?${queryParams.toString()}`
    );
    return response.data;
  },

  addRoom: async (formData: FormData): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/rooms/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateRoom: async (roomId: number, formData: FormData): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.put(`/rooms/update/${roomId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteRoom: async (roomId: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/rooms/delete/${roomId}`);
    return response.data;
  },
};

// Booking API calls
export const bookingAPI = {
  bookRoom: async (roomId: number, userId: number, booking: Booking): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      `/bookings/book-room/${roomId}/${userId}`, 
      booking
    );
    return response.data;
  },

  getAllBookings: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/bookings/all');
    return response.data;
  },

  getBookingByConfirmationCode: async (confirmationCode: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      `/bookings/get-by-confirmation-code/${confirmationCode}`
    );
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/bookings/cancel/${bookingId}`);
    return response.data;
  },
};

export default api;