import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import RoomCard from '../components/RoomCard';
import { ROOM_TYPES } from '../constants';
import { Search } from 'lucide-react';

const AllRooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [roomType, setRoomType] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const fetchAllRooms = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllRooms();
      if (response.roomList) {
        setRooms(response.roomList);
      }
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If searching, we need specific parameters or if cleared, fetch all
    if (!checkInDate && !checkOutDate && !roomType) {
        await fetchAllRooms();
        return;
    }

    try {
      const response = await ApiService.getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType);
      if (response.roomList) {
        setRooms(response.roomList);
      } else {
        setRooms([]); // No rooms found
      }
    } catch (err: any) {
       // If API returns 400 for missing fields, we might want to just show all rooms or show error
       // The API docs say it returns 400 if fields are missing for the specific "available-rooms-by-date-and-type" endpoint
       // But user might want to filter just by type using a client side filter if the API doesn't support partials well.
       // However, strictly following API usage:
       setError(err.message || "Failed to search rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setRoomType('');
    setCheckInDate('');
    setCheckOutDate('');
    fetchAllRooms();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Rooms</h1>
        
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <input 
                type="date" 
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input 
                type="date" 
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              >
                <option value="">All Types</option>
                {ROOM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
                <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
                >
                    <Search className="h-4 w-4 mr-2" /> Search
                </button>
                 <button 
                    type="button"
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                    Clear
                </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 border border-red-200">
              {error}
          </div>
      )}

      {loading ? (
        <div className="flex justify-center h-64 items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
            {rooms.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm">
                    <p className="text-xl">No rooms found based on your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default AllRooms;
