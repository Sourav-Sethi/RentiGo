import React from 'react';
import { motion } from 'framer-motion';

// --- Placeholder for Assets ---
// In your actual app, you would import this from '../assets/assets'
const assets = {
    testimonial_image_1: 'https://placehold.co/100x100/60A5FA/FFFFFF?text=User',
    testimonial_image_2: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=User',
    star_icon: 'https://img.icons8.com/fluency/48/star.png', // A placeholder star icon
};

// --- Helper Icon Component ---
const QuoteIcon = () => (
    <svg className="w-10 h-10 text-primary/20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
    </svg>
);

// --- Placeholder for Title Component ---
// This replicates the functionality of your Title component
const Title = ({ title, subTitle }) => (
    <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            {title}
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            {subTitle}
        </p>
    </div>
);

// --- Newsletter Component ---
const Newsletter = () => {
    return (
        <div className="bg-white py-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="container mx-auto px-4 flex flex-col items-center justify-center text-center"
            >
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800">Never Miss a Deal!</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                    Subscribe to get the latest offers, new arrivals, and exclusive discounts.
                </p>
                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center justify-center w-full max-w-lg mt-8"
                >
                    <input
                        className="w-full px-5 py-3 bg-slate-100 rounded-l-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none"
                        type="email"
                        placeholder="Enter your email address"
                        required
                    />
                    <button type="submit" className="px-6 py-3 text-white font-semibold bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-r-lg">
                        Subscribe
                    </button>
                </motion.form>
            </motion.div>
        </div>
    );
};


// --- Main Testimonial Component ---
const Testimonial = () => {
    const testimonials = [
        { 
            name: "Emma Rodriguez", 
            location: "Barcelona, Spain", 
            image: assets.testimonial_image_1, 
            testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional. The process was seamless and the car was immaculate." 
        },
        { 
            name: "John Smith", 
            location: "New York, USA", 
            image: assets.testimonial_image_2, 
            testimonial: "CarRental made my trip so much easier. The car was delivered right to my hotel, and the customer service was fantastic from start to finish!" 
        },
        { 
            name: "Ava Johnson", 
            location: "Sydney, Australia", 
            image: assets.testimonial_image_1, 
            testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with truly excellent service." 
        }
    ];

    
}

export default Testimonial;