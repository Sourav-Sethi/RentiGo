import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Placeholder for assets ---
const assets = {
    upload_icon: 'https://img.icons8.com/fluency/96/add-image.png',
    tick_icon: 'https://img.icons8.com/material-sharp/24/ffffff/checkmark--v1.png',
};

// --- Placeholder for Title Component ---
const Title = ({ title, subTitle }) => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 text-slate-500">{subTitle}</p>
    </div>
);

// --- Reusable Form Field Components for cleaner code ---
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none" />
    </div>
);

const SelectField = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select {...props} className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none appearance-none">
            {children}
        </select>
    </div>
);

// --- Main AddCar Component ---
const AddCar = () => {
    // --- State and Context Hooks (Your logic is preserved) ---
    const { axios, currency } = useAppContext();
    const [image, setImage] = useState(null);
    const [car, setCar] = useState({
        brand: '', model: '', year: '', pricePerDay: '', category: '',
        transmission: '', fuel_type: '', seating_capacity: '',
        location: '', description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // State for the stepper

    // --- Form Submission Handler (Your logic is preserved) ---
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        if (!image) {
            toast.error("Please upload a car image.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('carData', JSON.stringify(car));

            const { data } = await axios.post('/api/owner/add-car', formData);

            if (data.success) {
                toast.success(data.message);
                setImage(null);
                setCar({
                    brand: '', model: '', year: '', pricePerDay: '', category: '',
                    transmission: '', fuel_type: '', seating_capacity: '',
                    location: '', description: '',
                });
                setStep(1); // Reset to first step
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCar({ ...car, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const steps = ["Vehicle Info", "Specifications", "Details & Media"];
    
    return (
        <div className='flex-1 bg-slate-50 p-6 md:p-10'>
            <Title title="Add New Car" subTitle="Follow the steps to list a new car for booking." />

            {/* Stepper Navigation */}
            <div className="w-full max-w-2xl mx-auto mt-8">
                <div className="flex items-center justify-between">
                    {steps.map((stepName, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= index + 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {index + 1}
                                </div>
                                <p className={`mt-2 text-xs md:text-sm font-semibold ${step >= index + 1 ? 'text-primary' : 'text-slate-500'}`}>{stepName}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <form onSubmit={onSubmitHandler} className='mt-8 max-w-2xl mx-auto'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Step 1: Vehicle Info */}
                        {step === 1 && (
                            <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-800">Vehicle Info</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <InputField label="Brand" type="text" name="brand" placeholder="e.g. BMW" value={car.brand} onChange={handleInputChange} required />
                                    <InputField label="Model" type="text" name="model" placeholder="e.g. X5" value={car.model} onChange={handleInputChange} required />
                                    <InputField label="Year" type="number" name="year" placeholder="2024" value={car.year} onChange={handleInputChange} required />
                                    <InputField label={`Daily Price (${currency})`} type="number" name="pricePerDay" placeholder="100" value={car.pricePerDay} onChange={handleInputChange} required />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Specifications */}
                        {step === 2 && (
                             <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-800">Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <SelectField label="Category" name="category" value={car.category} onChange={handleInputChange} required>
                                        <option value="" disabled>Select category</option>
                                        <option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Van">Van</option>
                                    </SelectField>
                                    <SelectField label="Transmission" name="transmission" value={car.transmission} onChange={handleInputChange} required>
                                        <option value="" disabled>Select transmission</option>
                                        <option value="Automatic">Automatic</option><option value="Manual">Manual</option>
                                    </SelectField>
                                    <SelectField label="Fuel Type" name="fuel_type" value={car.fuel_type} onChange={handleInputChange} required>
                                        <option value="" disabled>Select fuel type</option>
                                        <option value="Gasoline">Gasoline</option><option value="Diesel">Diesel</option><option value="Electric">Electric</option><option value="Hybrid">Hybrid</option>
                                    </SelectField>
                                    <InputField label="Seating Capacity" type="number" name="seating_capacity" placeholder="5" value={car.seating_capacity} onChange={handleInputChange} required />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Details & Media */}
                        {step === 3 && (
                             <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-800">Details & Media</h3>
                                <div className="space-y-6 mt-4">
                                    <SelectField label="Location" name="location" value={car.location} onChange={handleInputChange} required>
                                        <option value="" disabled>Select location</option>
                                        <option value="New York">New York</option><option value="Los Angeles">Los Angeles</option><option value="Houston">Houston</option><option value="Chicago">Chicago</option>
                                    </SelectField>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                        <textarea name="description" rows={4} placeholder="e.g. A luxurious SUV with a spacious interior..." value={car.description} onChange={handleInputChange} required className='w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none'></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Car Image</label>
                                        <label htmlFor="car-image" className="mt-2 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                            {image ? (
                                                <img src={URL.createObjectURL(image)} alt="Car Preview" className="h-full w-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="text-center">
                                                    <img src={assets.upload_icon} alt="Upload" className="mx-auto h-12 w-12" />
                                                    <p className="mt-2 text-sm text-slate-500">Click to upload</p>
                                                </div>
                                            )}
                                            <input type="file" id="car-image" accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button type="button" onClick={prevStep} disabled={step === 1} className='px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'>
                        Back
                    </button>

                    {step < steps.length && (
                        <button type="button" onClick={nextStep} className='px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dull transition-all'>
                            Next
                        </button>
                    )}
                    
                    {step === steps.length && (
                        <button type="submit" disabled={isLoading} className='inline-flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dull transition-all disabled:bg-slate-400 disabled:cursor-not-allowed'>
                            <img src={assets.tick_icon} alt="" className="w-5 h-5" />
                            {isLoading ? 'Listing Car...' : 'List Your Car'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default AddCar;
