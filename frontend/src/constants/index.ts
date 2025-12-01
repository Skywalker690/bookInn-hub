
//export const REACT_APP_API_BASE_URL =  'http://localhost:8080';
export const REACT_APP_API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const ROOM_TYPES = [
  "Single",
  "Double",
  "Deluxe Suite",
  "Presidential Suite"
];
