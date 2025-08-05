import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Placeholder for assets ---
const assets = {
    eye_close_icon: 'https://img.icons8.com/material-outlined/24/737373/invisible.png',
    eye_icon: 'https://img.icons8.com/material-outlined/24/737373/visible.png',
    delete_icon: 'https://img.icons8.com/material-outlined/24/737373/trash.png',
};

// --- Placeholder for Title Component ---
const Title = ({ title, subTitle }) => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 text-slate-500">{subTitle}</p>
    </div>
);

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ onConfirm, onCancel }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center"
        >
            <h3 className="text-lg font-semibold text-slate-800">Are you sure?</h3>
            <p className="text-sm text-slate-500 mt-2">Do you really want to delete this car? This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-6">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors">
                    Cancel
                </button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                    Delete
                </button>
            </div>
        </motion.div>
    </motion.div>
);

// --- Main ManageCars Component ---
const ManageCars = () => {
    // --- State and Context Hooks (Your logic is preserved) ---
    const { isOwner, axios, currency } = useAppContext();
    const [cars, setCars] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);

    // --- Data Fetching (Your logic is preserved) ---
    const fetchOwnerCars = async () => {
        try {
            const { data } = await axios.get('/api/owner/cars');
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // --- Action Handlers (Your logic is preserved) ---
    const toggleAvailability = async (carId) => {
        try {
            const { data } = await axios.post('/api/owner/toggle-car', { carId });
            if (data.success) {
                toast.success(data.message);
                fetchOwnerCars();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteClick = (carId) => {
        setCarToDelete(carId);
        setShowDeleteModal(true);
    };

    const deleteCar = async () => {
        if (!carToDelete) return;
        try {
            const { data } = await axios.post('/api/owner/delete-car', { carId: carToDelete });
            if (data.success) {
                toast.success(data.message);
                fetchOwnerCars();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setShowDeleteModal(false);
            setCarToDelete(null);
        }
    };

    useEffect(() => {
        if (isOwner) {
            fetchOwnerCars();
        }
    }, [isOwner]);

    return (
        <div className='flex-1 bg-slate-50 p-6 md:p-10'>
            <Title title="Manage Cars" subTitle="View, update, and manage all your listed vehicles." />

            <div className='bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 overflow-x-auto'>
                <table className='w-full text-sm text-left text-slate-600'>
                    <thead className='text-xs text-slate-500 uppercase bg-slate-100'>
                        <tr>
                            <th scope="col" className="px-6 py-3">Car</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Category</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.length > 0 ? cars.map((car, index) => (
                            <tr key={car._id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={car.image} alt="" className="h-12 w-16 rounded-md object-cover"/>
                                        <div>
                                            <p className='font-bold'>{car.brand} {car.model}</p>
                                            <p className='text-xs text-slate-500'>{car.seating_capacity} Seats • {car.transmission}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">{car.category}</td>
                                <td className="px-6 py-4">{currency}{car.pricePerDay}/day</td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {car.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => toggleAvailability(car._id)} title={car.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                                            <img src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="Toggle" className='w-5 h-5' />
                                        </button>
                                        <button onClick={() => handleDeleteClick(car._id)} title="Delete Car" className="p-2 rounded-full hover:bg-red-100 transition-colors">
                                            <img src={assets.delete_icon} alt="Delete" className='w-5 h-5' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-16 text-slate-500">
                                    You haven't listed any cars yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <AnimatePresence>
                {showDeleteModal && (
                    <ConfirmationModal 
                        onConfirm={deleteCar}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default ManageCars;
