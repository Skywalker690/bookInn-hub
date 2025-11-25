import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { BookingDTO, UserDTO } from '../types';
import { Trash2, Calendar, MapPin, Phone, Mail, User, Clock, CheckCircle, AlertCircle, LogOut, Shield } from 'lucide-react';
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

    const getBookingStatus = (checkIn: string, checkOut: string) => {
        const now = new Date();
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (now > end) return { label: 'Completed', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: CheckCircle };
        if (now < start) return { label: 'Upcoming', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Calendar };
        return { label: 'Active', color: 'bg-green-50 text-green-600 border-green-200', icon: Clock };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="h-64 bg-gray-900 animate-pulse"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl h-96 shadow-lg animate-pulse"></div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl h-48 shadow-lg animate-pulse"></div>
                            <div className="bg-white rounded-2xl h-48 shadow-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Banner */}
            <div className="relative h-80 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                    <img
                        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt="Profile Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">My Dashboard</h1>
                    <p className="text-blue-200 text-lg font-light">Welcome back, {profile?.name}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 relative">

                            {/* Gradient Banner */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-36 rounded-t-2xl relative">
                                {/* Avatar anchored to banner bottom edge */}
                                <div className="absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 z-20">
                                    <div className="h-28 w-28 rounded-2xl bg-white p-1 shadow-xl">
                                        <div className="h-full w-full bg-gray-900 rounded-xl flex items-center justify-center text-white text-4xl font-bold font-serif">
                                            {profile?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="px-6 pb-8 pt-20 text-center">
                                <h2 className="text-2xl font-serif font-bold text-gray-900">{profile?.name}</h2>

                                <div className="flex justify-center items-center text-xs text-gray-500 mt-1">
                                    <Shield className="w-4 h-4 mr-1 text-blue-600" />
                                    <span className="font-medium uppercase tracking-wide">{profile?.role} Account</span>
                                </div>

                                <div className="mt-8 space-y-4">

                                    {/* Email */}
                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl group hover:bg-blue-50 transition-colors">
                                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-blue-600">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 overflow-hidden text-left">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                                Email Address
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{profile?.email}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl group hover:bg-blue-50 transition-colors">
                                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-blue-600">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-left">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone Number</p>
                                            <p className="text-sm font-medium text-gray-900">{profile?.phoneNumber || "Not Provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <div className="mt-10 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center space-x-2 border border-red-100 text-red-600 py-3 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all font-bold text-sm"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Booking History */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-serif">.</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {bookings.length} Bookings
                            </span>
                        </div>

                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center"><AlertCircle className="w-5 h-5 mr-2" />{error}</div>}

                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500 border border-gray-100 flex flex-col items-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No bookings yet</h3>
                                <p className="max-w-xs mx-auto mt-2 text-sm">You haven't made any reservations. Explore our suites to start your journey.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => {
                                    const status = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                                    const StatusIcon = status.icon;

                                    return (
                                        <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
                                            {/* Room Image (Left) */}
                                            <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                                                <img
                                                    src={booking.room?.roomPhotoUrl || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                                                    alt={booking.room?.roomType}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; }}
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                            </div>

                                            {/* Content (Right) */}
                                            <div className="p-6 flex flex-col justify-between flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border mb-3 ${status.color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            <span>{status.label}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 font-serif mb-1">
                                                            {booking.room ? booking.room.roomType : `Room #${booking.room?.id}`}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 font-mono">
                                                            Confirmation: <span className="text-gray-900 font-bold">{booking.bookingConfirmationCode}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-lg font-bold text-gray-900">${booking.room?.roomPrice}</p>
                                                        <p className="text-xs text-gray-500">per night</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-50 pt-4">
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase font-bold">Check-in</p>
                                                        <p className="text-sm font-semibold text-gray-900 flex items-center mt-1">
                                                            <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
                                                            {booking.checkInDate}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase font-bold">Check-out</p>
                                                        <p className="text-sm font-semibold text-gray-900 flex items-center mt-1">
                                                            <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
                                                            {booking.checkOutDate}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-between items-center">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-bold text-gray-900">{booking.totalNumOfGuest}</span> Guests
                                                    </p>

                                                    {status.label !== 'Completed' && (
                                                        <button
                                                            onClick={() => initiateCancel(booking.id)}
                                                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1.5" /> Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmCancel}
                    title="Cancel Reservation"
                    message="Are you sure you want to cancel this reservation? This action cannot be undone and may be subject to cancellation fees."
                />
            </div>
        </div>
    );
};

export default Profile;