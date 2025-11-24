import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { BookingDTO } from '../types';

const FindBooking: React.FC = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [booking, setBooking] = useState<BookingDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!confirmationCode.trim()) return;
        
        setLoading(true);
        setError('');
        setBooking(null);

        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            if (response.statusCode === 200 && response.booking) {
                setBooking(response.booking);
            } else {
                setError(response.message || 'Booking not found');
            }
        } catch (err: any) {
            setError(err.message || 'Error finding booking. Please check the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Find Your Booking
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your confirmation code to view booking details.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSearch}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="confirmation-code" className="sr-only">Confirmation Code</label>
                            <input
                                id="confirmation-code"
                                name="code"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm shadow-sm"
                                placeholder="Confirmation Code (e.g. ABC123456)"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-70"
                        >
                            {loading ? 'Searching...' : 'Find Booking'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-center text-sm" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </div>

            {booking && (
                <div className="mt-10 w-full max-w-2xl bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-bold text-gray-900">
                                Booking Details
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Confirmation Code: <span className="font-mono font-bold text-blue-600">{booking.bookingConfirmationCode}</span>
                            </p>
                        </div>
                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wide">
                            Confirmed
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Dates</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div className="flex space-x-4">
                                        <div>
                                            <span className="block text-xs text-gray-500 uppercase">Check-in</span>
                                            <span className="font-semibold">{booking.checkInDate}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 uppercase">Check-out</span>
                                            <span className="font-semibold">{booking.checkOutDate}</span>
                                        </div>
                                    </div>
                                </dd>
                            </div>
                            
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Guests</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {booking.totalNumOfGuest} Total ({booking.numOfAdults} Adults, {booking.numOfChildren} Children)
                                </dd>
                            </div>

                            {booking.user && (
                                 <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Guest Info</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <p className="font-medium">{booking.user.name}</p>
                                        <p className="text-gray-500">{booking.user.email}</p>
                                    </dd>
                                </div>
                            )}

                            {booking.room && (
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Room Info</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {booking.room.roomPhotoUrl && (
                                                <img 
                                                    src={booking.room.roomPhotoUrl} 
                                                    alt="Room" 
                                                    className="w-full sm:w-32 h-24 object-cover rounded-md"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/200/200?grayscale'; }}
                                                />
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">{booking.room.roomType}</div>
                                                <div className="text-blue-600 font-semibold mt-1">${booking.room.roomPrice} <span className="text-gray-500 font-normal text-xs">/ night</span></div>
                                                <div className="text-gray-500 text-xs mt-1 line-clamp-2">{booking.room.roomDescription}</div>
                                            </div>
                                        </div>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            )}
        </div>
    );
};
export default FindBooking;