import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Icon Component ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 hover:text-slate-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Login = () => {
    // --- State and Context Hooks (Your logic is preserved) ---
    const { setShowLogin, axios, setToken, navigate } = useAppContext();
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // --- Form Submission Handler (Your logic is preserved) ---
    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

            if (data.success) {
                navigate('/');
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
                toast.success(`Welcome ${state === 'login' ? '' : name}!`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogin(false)} 
                className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
            >
                <motion.form 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onSubmit={onSubmitHandler} 
                    onClick={(e) => e.stopPropagation()} 
                    className="relative flex flex-col gap-5 bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl"
                >
                    {/* Close Button */}
                    <button type="button" onClick={() => setShowLogin(false)} className="absolute top-4 right-4">
                        <CloseIcon />
                    </button>

                    {/* Header */}
                    <h2 className="text-3xl font-bold text-center text-slate-800 w-full">
                        {state === "login" ? "Welcome Back" : "Create Account"}
                    </h2>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-4 w-full mt-4">
                        {state === "register" && (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                                <input 
                                    onChange={(e) => setName(e.target.value)} 
                                    value={name} 
                                    placeholder="Enter your name" 
                                    className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none" 
                                    type="text" 
                                    required 
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                placeholder="you@example.com" 
                                className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none" 
                                type="email" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                placeholder="••••••••" 
                                className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none" 
                                type="password" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full py-3 mt-4 bg-primary hover:bg-primary-dull transition-all text-white font-bold rounded-lg cursor-pointer">
                        {state === "register" ? "Create Account" : "Login"}
                    </button>

                    {/* Toggle between Login/Register */}
                    <p className="text-center text-sm text-slate-500">
                        {state === "register" 
                            ? "Already have an account?" 
                            : "Don't have an account?"
                        }
                        <span onClick={() => setState(state === "login" ? "register" : "login")} className="font-semibold text-primary cursor-pointer ml-1">
                            {state === "register" ? "Login" : "Sign Up"}
                        </span>
                    </p>
                </motion.form>
            </motion.div>
        </AnimatePresence>
    );
}

export default Login;
