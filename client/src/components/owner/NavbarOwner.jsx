import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const NavbarOwner = () => {
    const { user } = useAppContext();

    return (
        <header className='flex items-center justify-between px-6 md:px-10 py-3 bg-white border-b border-slate-200 sticky top-0 z-30'>
            {/* Logo */}
            <Link to='/'>
                <motion.div whileHover={{ scale: 1.05 }}>
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

            {/* Welcome Message */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 hidden sm:block">Welcome,</span>
                <span className="font-semibold text-slate-800">{user?.name || "Owner"}</span>
            </div>
        </header>
    );
}

export default NavbarOwner;
