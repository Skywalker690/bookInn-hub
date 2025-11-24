import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import { useAuth } from '../context/AuthContext';
import { Check, User, Users, Calendar, Wifi, Coffee, Monitor, Wind, ShieldCheck, Star } from 'lucide-react';

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  if (loading) {
    return (
        <div className="bg-white font-sans min-h-screen">
            {/* Skeleton Hero */}
            <div className="h-[60vh] w-full bg-gray-200 animate-pulse relative">
                 <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto space-y-4">
                     <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
                     <div className="h-16 w-1/2 bg-gray-300 rounded"></div>
                     <div className="h-6 w-48 bg-gray-300 rounded"></div>
                 </div>
            </div>
            {/* Skeleton Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="flex flex-col lg:flex-row gap-16">
                     <div className="lg:w-2/3 space-y-8">
                         <div className="space-y-4">
                             <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                             <div className="space-y-2">
                                 <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                 <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                 <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                             </div>
                         </div>
                         <div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
                     </div>
                     <div className="lg:w-1/3">
                         <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                     </div>
                 </div>
            </div>
        </div>
    );
  }

  if (!room) return <div className="text-center py-20 text-gray-500">Room not found.</div>;

  const imageUrl = room.roomPhotoUrl || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Immersive Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={room.roomType} 
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
           <div className="animate-fade-in-up">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Premium Collection
                </span>
                <h1 className="text-4xl md:text-6xl font-bold font-serif mb-2 text-shadow-lg">{room.roomType}</h1>
                <div className="flex items-center space-x-4 text-gray-200 text-lg">
                    <span className="flex items-center"><Users className="w-5 h-5 mr-2" /> 2-4 Guests</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" /> 5.0 Rating</span>
                </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Details */}
          <div className="lg:w-2/3">
            <div className="mb-12">
               <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">About this Suite</h2>
               <p className="text-gray-600 leading-8 text-lg mb-8 font-light">
                 {room.roomDescription} 
                 {/* Fallback descriptive text if the API description is short */}
                 {!room.roomDescription.includes('.') && " Experience the epitome of luxury in our meticulously designed suite. Featuring panoramic views, bespoke furniture, and an ambiance of tranquility, this is the perfect sanctuary for the discerning traveler."}
               </p>
               
               <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Amenities</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                 {[
                   { icon: Wifi, label: "High-Speed Wifi" },
                   { icon: Coffee, label: "Coffee Maker" },
                   { icon: Monitor, label: "Smart TV 55\"" },
                   { icon: Wind, label: "Air Conditioning" },
                   { icon: ShieldCheck, label: "In-room Safe" },
                   { icon: Users, label: "Room Service" }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center text-gray-600">
                     <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
                        <item.icon className="w-5 h-5" />
                     </div>
                     <span>{item.label}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">House Rules</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" /> Check-in: 3:00 PM - 10:00 PM</li>
                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" /> Check-out: 11:00 AM</li>
                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" /> No smoking</li>
                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" /> Pets are not allowed</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 px-8 py-6 text-white">
                    <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold font-serif">${room.roomPrice}</span>
                        <span className="text-gray-400 font-light">/ night</span>
                    </div>
                </div>
                
                <div className="p-8">
                    {successMessage && (
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 border border-green-200 flex items-start">
                            <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {isAuthenticated ? (
                        <form onSubmit={handleBookingSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Check In</label>
                                        <div className="relative">
                                            <input 
                                                type="date" 
                                                name="checkInDate"
                                                required
                                                value={bookingData.checkInDate}
                                                onChange={handleBookingChange}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Check Out</label>
                                        <div className="relative">
                                            <input 
                                                type="date" 
                                                name="checkOutDate"
                                                required
                                                value={bookingData.checkOutDate}
                                                onChange={handleBookingChange}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guests</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input 
                                                type="number" 
                                                name="numOfAdults"
                                                min="1"
                                                required
                                                placeholder="Adults"
                                                value={bookingData.numOfAdults}
                                                onChange={handleBookingChange}
                                                className="w-full pl-10 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Users className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input 
                                                type="number" 
                                                name="numOfChildren"
                                                min="0"
                                                placeholder="Children"
                                                value={bookingData.numOfChildren}
                                                onChange={handleBookingChange}
                                                className="w-full pl-10 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={bookingLoading}
                                className={`w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 ${bookingLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {bookingLoading ? 'Processing...' : 'Reserve Now'}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">You won't be charged yet</p>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-6">Sign in to book your stay at our exclusive member rates.</p>
                            <button 
                                onClick={() => navigate('/login', { state: { from: `/rooms/${room.id}` } })}
                                className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors"
                            >
                                Login to Book
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;