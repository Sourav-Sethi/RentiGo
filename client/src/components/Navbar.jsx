import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// It's good practice to get assets from a central place, as you are doing.
import { assets, menuLinks } from '../assets/assets';

// --- Helper Components for Icons ---
// Using SVG components makes them easy to style with Tailwind's text color classes.
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const Navbar = () => {
    // --- State and Context Hooks ---
    const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // --- Functions ---
    const changeRole = async () => {
        try {
            const { data } = await axios.post('/api/owner/change-role');
            if (data.success) {
                setIsOwner(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    // --- Dynamic Styling ---
    const isActive = (path) => location.pathname === path;
    
    // Close mobile menu on route change and on resize to desktop
    useEffect(() => {
        const closeMenu = () => setOpen(false);
        window.addEventListener('resize', closeMenu);
        closeMenu(); // Close on route change
        return () => window.removeEventListener('resize', closeMenu);
    }, [location.pathname]);

    return (
        // This header is sticky, meaning it scrolls with the page until it hits the top, then stays there.
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 bg-slate-100/80 backdrop-blur-lg border-b border-slate-200/80"
        >
            <nav className="container mx-auto flex items-center justify-between p-4 text-slate-800">
                
                {/* Left Side: Logo */}
                <Link to='/'>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        {/* SVG Logo is now directly embedded */}
                        <svg width="158" height="32" viewBox="0 0 158 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                                    <stop offset="100%" style={{stopColor: '#60A5FA', stopOpacity: 1}} />
                                </linearGradient>
                            </defs>
                            <path d="M22 4L12 16L22 28H28L18 16L28 4H22Z" fill="url(#grad1)"/>
                            <path d="M14 4L4 16L14 28H20L10 16L20 4H14Z" fill="url(#grad1)" fillOpacity="0.6"/>
                            <text x="40" y="23" fontFamily="Montserrat, sans-serif" fontSize="20" fontWeight="700" fill="#1E293B">RentiGo</text>
                        </svg>
                    </motion.div>
                </Link>

                {/* Right Side: Combined Links, Search, and Buttons */}
                <div className="hidden md:flex items-center gap-x-6">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-x-2 text-sm font-medium">
                        {menuLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`
                                    px-4 py-2 rounded-lg transition-colors duration-300
                                    ${isActive(link.path) 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-slate-600 hover:bg-white/60'}
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative hidden lg:block">
                        <input 
                            type="text" 
                            placeholder="Search cars..."
                            className="w-48 rounded-full bg-white/60 border-transparent focus:border-primary focus:ring-primary focus:outline-none pl-4 pr-10 py-2 text-sm transition-all duration-300 focus:w-56"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                            <SearchIcon />
                        </div>
                    </div>

                    {/* Dashboard & Auth Buttons */}
                    <div className="flex items-center gap-x-4">
                        <button 
                            onClick={() => isOwner ? navigate('/owner') : changeRole()} 
                            className="cursor-pointer text-sm font-medium text-slate-600 hover:text-primary transition-colors duration-200"
                        >
                            {isOwner ? 'Dashboard' : 'List cars'}
                        </button>
                        
                        <button 
                            onClick={() => { user ? logout() : setShowLogin(true) }} 
                            className="cursor-pointer bg-primary hover:bg-primary-dull text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 text-sm"
                        >
                            {user ? 'Logout' : 'Login'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className='md:hidden cursor-pointer z-50' aria-label="Menu" onClick={() => setOpen(!open)}>
                    {open ? <CloseIcon /> : <MenuIcon />}
                </button>

                {/* Mobile Menu Panel using AnimatePresence for smooth entry/exit */}
                <AnimatePresence>
                {open && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black/40 z-40"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-slate-50 p-8 pt-20 shadow-xl"
                            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the menu
                        >
                            <div className="flex flex-col space-y-5">
                                {/* Mobile Search Bar */}
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search cars..."
                                        className="w-full rounded-full bg-white border-transparent focus:border-primary focus:ring-primary focus:outline-none pl-4 pr-10 py-3 text-base"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                        <SearchIcon />
                                    </div>
                                </div>

                                {menuLinks.map((link) => (
                                    <Link 
                                        key={link.name} 
                                        to={link.path}
                                        className={`block text-lg font-medium ${isActive(link.path) ? 'text-primary' : 'text-slate-700'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="border-slate-200" />
                                <button 
                                    onClick={() => { isOwner ? navigate('/owner') : changeRole(); }} 
                                    className="cursor-pointer block text-lg font-medium text-slate-700 text-left"
                                >
                                    {isOwner ? 'Dashboard' : 'List cars'}
                                </button>
                                <button 
                                    onClick={() => { user ? logout() : setShowLogin(true); }} 
                                    className="cursor-pointer w-full bg-primary hover:bg-primary-dull text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 text-center"
                                >
                                    {user ? 'Logout' : 'Login'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}

export default Navbar;
