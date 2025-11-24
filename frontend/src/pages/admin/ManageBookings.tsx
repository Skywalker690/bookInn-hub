import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { BookingDTO } from '../../types';
import { Trash2 } from 'lucide-react';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await ApiService.cancelBooking(id);
        fetchBookings();
      } catch (error) {
        alert('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conf. Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No bookings found.</td>
                </tr>
            ) : (
                bookings.map((booking) => (
                <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{booking.bookingConfirmationCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.room?.roomType} (ID: {booking.room?.id})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOutDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.totalNumOfGuest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleCancel(booking.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
