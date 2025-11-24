import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import { useAuth } from '../context/AuthContext';

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numOfAdults: 1,
    numOfChildren: 0
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!roomId) return;
        const response = await ApiService.getRoomById(roomId);
        if (response.room) {
          setRoom(response.room);
        } else {
          setError('Room not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
        navigate('/login', { state: { from: location } });
        return;
    }

    setBookingLoading(true);
    setError('');
    setSuccessMessage('');

    try {
        if (!room) return;
        
        const response = await ApiService.bookRoom(room.id, user.id, bookingData);
        if (response.statusCode === 200) {
            setSuccessMessage(`Booking Confirmed! Code: ${response.bookingConfirmationCode}`);
            // Reset form
            setBookingData({
                checkInDate: '',
                checkOutDate: '',
                numOfAdults: 1,
                numOfChildren: 0
            });
        } else {
            setError(response.message || 'Booking failed');
        }
    } catch (err: any) {
        setError(err.message || 'Booking failed. Room might be unavailable.');
    } finally {
        setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!room) return <div className="text-center py-20 text-red-600">Room not found.</div>;

  const imageUrl = room.roomPhotoUrl || 'https://picsum.photos/800/400';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-1/2 h-96 md:h-auto">
            <img 
              src={imageUrl} 
              alt={room.roomType} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/800/400?grayscale'; }}
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.roomType}</h1>
                <p className="text-2xl text-blue-600 font-semibold mb-6">${room.roomPrice} <span className="text-sm text-gray-500 font-normal">/ night</span></p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                {room.roomDescription}
                </p>
            </div>

            {/* Booking Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Book This Room</h3>
                
                {successMessage && (
                    <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm border border-green-200">
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {isAuthenticated ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Check In</label>
                                <input 
                                    type="date" 
                                    name="checkInDate"
                                    required
                                    value={bookingData.checkInDate}
                                    onChange={handleBookingChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Check Out</label>
                                <input 
                                    type="date" 
                                    name="checkOutDate"
                                    required
                                    value={bookingData.checkOutDate}
                                    onChange={handleBookingChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Adults</label>
                                <input 
                                    type="number" 
                                    name="numOfAdults"
                                    min="1"
                                    required
                                    value={bookingData.numOfAdults}
                                    onChange={handleBookingChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Children</label>
                                <input 
                                    type="number" 
                                    name="numOfChildren"
                                    min="0"
                                    value={bookingData.numOfChildren}
                                    onChange={handleBookingChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={bookingLoading}
                            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition ${bookingLoading ? 'opacity-70' : ''}`}
                        >
                            {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">Please log in to book this room.</p>
                        <button 
                            onClick={() => navigate('/login', { state: { from: `/rooms/${room.id}` } })}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
