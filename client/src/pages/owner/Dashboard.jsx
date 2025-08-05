import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

// --- Placeholder for assets ---
// In a real app, these would be imported from your assets file.
const assets = {
    carIconColored: 'https://img.icons8.com/fluency/48/car.png',
    listIconColored: 'https://img.icons8.com/fluency/48/list.png',
    cautionIconColored: 'https://img.icons8.com/fluency/48/error.png',
};

// --- Placeholder for Title Component ---
const Title = ({ title, subTitle }) => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 text-slate-500">{subTitle}</p>
    </div>
);

// --- Main Dashboard Component ---
const Dashboard = () => {
    // --- State and Context Hooks (Your logic is preserved) ---
    const { axios, isOwner, currency } = useAppContext();
    const [data, setData] = useState({
        totalCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0,
    });

    // --- Data Fetching (Your logic is preserved) ---
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/owner/dashboard');
            if (data.success) {
                setData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isOwner) {
            fetchDashboardData();
        }
    }, [isOwner]);

    // --- Data for Cards (Your logic is preserved) ---
    const dashboardCards = [
        { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored, color: 'blue' },
        { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored, color: 'purple' },
        { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored, color: 'orange' },
        { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored, color: 'green' },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-orange-100 text-orange-700';
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className='flex-1 bg-slate-50 p-6 md:p-10'>
            <Title title="Admin Dashboard" subTitle="Monitor overall platform performance and recent activities." />

            {/* --- Dashboard Cards --- */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8'>
                {dashboardCards.map((card, index) => (
                    <div key={index} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between`}>
                        <div>
                            <p className='text-sm text-slate-500'>{card.title}</p>
                            <p className='text-3xl font-bold text-slate-800 mt-1'>{card.value}</p>
                        </div>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${card.color}-100`}>
                            <img src={card.icon} alt="" className='h-6 w-6' />
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* --- Recent Bookings --- */}
                <div className='lg:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm'>
                    <h2 className='text-xl font-semibold text-slate-800'>Recent Bookings</h2>
                    <p className='text-sm text-slate-500 mb-4'>Latest customer bookings from your listings.</p>
                    <div className="space-y-4">
                        {data.recentBookings.length > 0 ? data.recentBookings.map((booking, index) => (
                            <div key={index} className='flex items-center justify-between p-3 rounded-lg hover:bg-slate-50'>
                                <div className='flex items-center gap-4'>
                                    <div className='hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                                        <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700">{booking.car.brand} {booking.car.model}</p>
                                        <p className='text-sm text-slate-500'>{new Date(booking.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p className='font-semibold text-slate-700'>{currency}{booking.price}</p>
                                    <p className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(booking.status)}`}>{booking.status}</p>
                                </div>
                            </div>
                        )) : <p className="text-center text-slate-500 py-8">No recent bookings found.</p>}
                    </div>
                </div>

                {/* --- Monthly Revenue --- */}
                <div className='p-6 bg-white border border-slate-200 rounded-2xl shadow-sm'>
                    <h2 className='text-xl font-semibold text-slate-800'>Monthly Revenue</h2>
                    <p className='text-sm text-slate-500'>Revenue for the current month.</p>
                    <div className="flex items-baseline gap-2 mt-6">
                         <p className='text-5xl font-bold text-primary'>{currency}{data.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">+12% from last month</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
