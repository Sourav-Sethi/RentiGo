import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

// Import assets from your assets file
import { assets, cityList } from '../assets/assets';

// --- Helper Icon Components ---
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const Hero = () => {
    // --- State management from your provided code ---
    const [pickupLocation, setPickupLocation] = useState('');
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

    // --- Search handler from your provided code ---
    const handleSearch = (e) => {
        e.preventDefault();
        // Navigate to the cars page with query parameters
        navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate);
    };

    return (
        <div className="bg-slate-50">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* --- Left Side: Text and Booking Form --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
                            Luxury Cars on Rent, <br />
                            <span className="text-primary">Ready for You.</span>
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Experience the thrill of driving a luxury car. Book your ride in just a few clicks.
                        </p>

                        {/* Booking Form with your logic */}
                        <motion.form 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                            onSubmit={handleSearch}
                            className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-slate-200"
                        >
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Pickup Location */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Pickup Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <LocationIcon />
                                        </div>
                                        <select 
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select location</option>
                                            {/* Mapping over your cityList */}
                                            {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {/* Pickup Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Pick-up Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <CalendarIcon />
                                        </div>
                                        <input 
                                            type="date"
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Return Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Return Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <CalendarIcon />
                                        </div>
                                        <input 
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            min={pickupDate || new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="w-full mt-5 py-3 bg-primary hover:bg-primary-dull transition-all text-white font-bold rounded-lg cursor-pointer"
                            >
                                Search Cars
                            </motion.button>
                        </motion.form>
                    </motion.div>

                    {/* --- Right Side: Car Image --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                        className="hidden md:block"
                    >
                        {/* Using your car image from assets */}
                        <img 
                            src={assets.main_car}
                            alt="Luxury Car" 
                            className="w-full h-auto object-contain"
                        />
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default Hero;
