import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Placeholder for Title Component ---
const Title = ({ title, subTitle }) => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 text-slate-500">{subTitle}</p>
    </div>
);

// --- Main ManageBookings Component ---
const ManageBookings = () => {
    // --- State and Context Hooks (Your logic is preserved) ---
    const { currency, axios } = useAppContext();
    const [bookings, setBookings] = useState([]);

    // --- Data Fetching and Action Handlers (Your logic is preserved) ---
    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner');
            data.success ? setBookings(data.bookings) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
            if (data.success) {
                toast.success(data.message);
                fetchOwnerBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchOwnerBookings();
    }, []);

    // --- Helper function for styling status tags ---
    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'confirmed':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className='flex-1 bg-slate-50 p-6 md:p-10'>
            <Title title="Manage Bookings" subTitle="Track, approve, or cancel all customer booking requests." />

            <div className='bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 overflow-x-auto'>
                <table className='w-full text-sm text-left text-slate-600'>
                    <thead className='text-xs text-slate-500 uppercase bg-slate-100'>
                        <tr>
                            <th scope="col" className="px-6 py-3">Customer / Car</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Date Range</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Payment</th>
                            <th scope="col" className="px-6 py-3 text-center">Status / Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {bookings.length > 0 ? bookings.map((booking) => (
                                <motion.tr 
                                    key={booking._id} 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white border-b border-slate-200 hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={booking.car.image} alt="" className="h-12 w-16 rounded-md object-cover"/>
                                            <div>
                                                <p className='font-bold'>{booking.user.name}</p>
                                                <p className='text-xs text-slate-500'>{booking.car.brand} {booking.car.model}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span>{new Date(booking.pickupDate).toLocaleDateString()}</span>
                                            <span className="text-slate-400">to {new Date(booking.returnDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{currency}{booking.price}</td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className='px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700'>
                                            Offline
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {booking.status === 'pending' ? (
                                            <select 
                                                onChange={e => changeBookingStatus(booking._id, e.target.value)} 
                                                value={booking.status} 
                                                className={`px-3 py-1.5 text-xs font-semibold border rounded-lg outline-none transition-colors ${getStatusStyles(booking.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirm</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(booking.status)}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        )}
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-16 text-slate-500">
                                        You have no bookings yet.
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageBookings;
