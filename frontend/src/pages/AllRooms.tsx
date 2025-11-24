import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import RoomCard from '../components/RoomCard';
import { ROOM_TYPES } from '../constants';
import { Search, Calendar, Filter, X } from 'lucide-react';

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

    if (!checkInDate && !checkOutDate && !roomType) {
        await fetchAllRooms();
        return;
    }

    try {
      const response = await ApiService.getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType);
      if (response.roomList) {
        setRooms(response.roomList);
      } else {
        setRooms([]);
      }
    } catch (err: any) {
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
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center">
         <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
         >
            <div className="absolute inset-0 bg-black/50"></div>
         </div>
         <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 tracking-tight">Our Accommodations</h1>
            <p className="text-lg md:text-xl font-light text-gray-200 max-w-2xl mx-auto">
              Discover a collection of rooms and suites designed for your ultimate comfort and relaxation.
            </p>
         </div>
      </div>

      {/* Floating Search Bar */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                <input 
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-700 font-medium"
                />
              </div>
            </div>
            
            <div className="relative group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                <input 
                  type="date" 
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-700 font-medium"
                />
              </div>
            </div>
            
            <div className="relative group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Room Type</label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-700 font-medium appearance-none"
                >
                  <option value="">All Collections</option>
                  {ROOM_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-end gap-3">
                <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex justify-center items-center h-[52px]"
                >
                    <Search className="h-5 w-5 mr-2" /> Check Availability
                </button>
                 <button 
                    type="button"
                    onClick={handleClearFilters}
                    className="px-5 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 flex items-center justify-center h-[52px] shadow-sm whitespace-nowrap group"
                    title="Clear All Filters"
                >
                    <X className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> 
                    Clear
                </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-7xl">
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200 flex items-center justify-center">
                {error}
            </div>
        )}

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="h-72 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="h-12 bg-gray-200 rounded mt-auto animate-pulse"></div>
                    </div>
                </div>
                ))}
            </div>
        ) : (
            <>
                {rooms.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No rooms available</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                        {rooms.map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default AllRooms;