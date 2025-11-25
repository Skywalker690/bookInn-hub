import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { BookingDTO, UserDTO } from '../types';
import { Trash2 } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Profile: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserDTO | null>(null);
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

  const fetchProfileData = async () => {
    try {
      // Fetch full profile info
      const userResponse = await ApiService.getUserProfile();
      if (userResponse.user) {
        setProfile(userResponse.user);
        
        // Fetch bookings
        if (userResponse.user.bookings && userResponse.user.bookings.length > 0) {
            setBookings(userResponse.user.bookings);
        } else {
            // Fallback to fetch specific history if empty
            const bookingResponse = await ApiService.getUserBookings(userResponse.user.id.toString());
            if (bookingResponse.bookingList) {
                setBookings(bookingResponse.bookingList);
            }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initiateCancel = (bookingId: number) => {
    setBookingToDelete(bookingId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToDelete) return;
    
    try {
        await ApiService.cancelBooking(bookingToDelete);
        // Refresh bookings
        fetchProfileData();
    } catch (err: any) {
        alert(err.message || "Failed to cancel booking");
    }
  };

  if (loading) {
      return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Skeleton */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col items-center">
                         <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                         <div className="h-6 w-32 bg-gray-200 animate-pulse mb-2 rounded"></div>
                         <div className="h-4 w-20 bg-gray-200 animate-pulse mb-6 rounded"></div>
                         <div className="w-full space-y-4">
                             <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
                             <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
                         </div>
                    </div>
                </div>
                {/* Bookings Skeleton */}
                <div className="md:col-span-2 space-y-4">
                    <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-32 animate-pulse flex justify-between">
                             <div className="space-y-3 w-1/2">
                                 <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                 <div className="h-4 w-full bg-gray-200 rounded"></div>
                                 <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600 text-3xl font-bold">
                        {profile?.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
                    <p className="text-sm text-gray-500">{profile?.role}</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase">Email</label>
                        <p className="text-gray-800 font-medium">{profile?.email}</p>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase">Phone</label>
                        <p className="text-gray-800 font-medium">{profile?.phoneNumber}</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button 
                        onClick={logout}
                        className="w-full border border-red-200 text-red-600 py-2 rounded hover:bg-red-50 transition text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>

        {/* Booking History */}
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>
            
            {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

            {bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                    <p>You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                                        {booking.bookingConfirmationCode}
                                    </span>
                                    <span className="text-gray-900 font-bold">
                                        {booking.room ? booking.room.roomType : `Room ID: ${booking.room?.id}`}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Check-in: <span className="font-medium text-gray-800">{booking.checkInDate}</span></p>
                                    <p>Check-out: <span className="font-medium text-gray-800">{booking.checkOutDate}</span></p>
                                    <p>Guests: {booking.totalNumOfGuest} ({booking.numOfAdults} Adults, {booking.numOfChildren} Children)</p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <button 
                                    onClick={() => initiateCancel(booking.id)}
                                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded transition text-sm"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </div>
  );
};

export default Profile;