import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { BookingDTO } from '../../types';
import { Trash2, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllBookings();
      if (response.bookingList) {
        setBookings(response.bookingList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const initiateCancel = (id: number) => {
    setBookingToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToDelete) return;
    try {
      await ApiService.cancelBooking(bookingToDelete);
      fetchBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const totalGuests = bookings.reduce((acc, curr) => acc + curr.totalNumOfGuest, 0);
  const recentBookings = bookings.slice(0, 5); // Just a placeholder logic for 'recent'

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-gray-900">Booking Overview</h1>
            <p className="text-gray-500 mt-1">Track reservations and guest statistics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Guests</p>
                    <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Active Reservations</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl shadow-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                    <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Confirmation</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Guest & Room</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Party Size</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {loading && (
                         <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading bookings...</td></tr>
                    )}
                    
                    {!loading && bookings.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-500">
                                <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <p>No bookings found.</p>
                            </td>
                        </tr>
                    ) : (
                        bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-sm font-bold border border-blue-100">
                                    {booking.bookingConfirmationCode}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">{booking.room?.roomType}</span>
                                    <span className="text-xs text-gray-500">{booking.user?.email}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                    <div className="text-xs text-gray-500 uppercase">In: <span className="text-gray-900 font-medium">{booking.checkInDate}</span></div>
                                    <div className="text-xs text-gray-500 uppercase">Out: <span className="text-gray-900 font-medium">{booking.checkOutDate}</span></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>{booking.totalNumOfGuest}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => initiateCancel(booking.id)} 
                                className="group flex items-center justify-end w-full text-red-600 hover:text-red-900"
                                title="Cancel Booking"
                            >
                                <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase">Cancel</span>
                                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </div>
                            </button>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>
        </div>

        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleCancelConfirm}
            title="Cancel Booking"
            message="Are you sure you want to cancel this booking? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ManageBookings;