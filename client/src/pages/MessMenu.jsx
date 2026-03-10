import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
    Utensils, Coffee, Sun, Soup, Star, ArrowLeft, Loader2,
    Calendar, CheckCircle2, Info, Moon, Search as SearchIcon,
    Home as HomeIcon, BookOpen, Map as MapIcon
} from "lucide-react";
import { toast } from "react-toastify";

export default function MessMenu() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [activeDay, setActiveDay] = useState(days[new Date().getDay()]);
    const navigate = useNavigate();

    useEffect(() => {
        // Auth check
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Sign in to view today\'s menu!");
            navigate("/login");
            return;
        }
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/mess");
            setMenu(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load mess menu");
        } finally {
            setLoading(false);
        }
    };

    const currentDayMenu = menu.filter(m => m.day === activeDay);

    const MealIcon = ({ type }) => {
        switch (type) {
            case 'Breakfast': return <Coffee className="text-orange-500" size={24} />;
            case 'Lunch': return <Sun className="text-yellow-500" size={24} />;
            case 'Snacks': return <Soup className="text-emerald-500" size={24} />;
            case 'Dinner': return <Moon className="text-indigo-500" size={24} />;
            default: return <Utensils className="text-gray-500" size={24} />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5]">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Cooking something good...</p>
        </div>
    );

    return (
        <div className="min-h-screen text-gray-900 bg-[#f0f2f5] px-6 py-10">

            {/* Nav Bar */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all text-gray-500 hover:text-indigo-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Mess Menu</h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2">
                            VIT Chennai • Today is {days[new Date().getDay()]}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-1">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${activeDay === day
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Main Menu List */}
                <div className="md:col-span-8 space-y-6">
                    {currentDayMenu.map((meal) => (
                        <div key={meal.id} className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-8 md:w-48 bg-gray-50 border-r border-gray-100 flex flex-col items-center justify-center text-center group-hover:bg-indigo-50/20 transition-colors">
                                    <MealIcon type={meal.meal_type} />
                                    <h3 className="mt-3 font-black text-gray-900 uppercase tracking-tighter text-sm">{meal.meal_type}</h3>
                                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                        {meal.meal_type === 'Breakfast' ? '7:30 - 9:00' :
                                            meal.meal_type === 'Lunch' ? '12:00 - 1:30' :
                                                meal.meal_type === 'Snacks' ? '4:30 - 5:30' : '7:30 - 9:00'}
                                    </span>
                                </div>
                                <div className="p-8 flex-grow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-2">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic">
                                                Veg & Non-Veg
                                            </span>
                                            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                Special Option
                                            </span>
                                        </div>
                                        <span className="text-gray-300">
                                            <Star size={16} />
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800 leading-relaxed tracking-tight underline decoration-indigo-600/10 underline-offset-8">
                                        {meal.items}
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quality Checked</span>
                                        </div>
                                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all">
                                            Feedback <Info size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Panel */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Utensils size={200} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 tracking-tighter">Healthy Eating</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed font-medium mb-8">
                            High protein options are now available for dinner. Make sure to choose the special mess counter for grilled chicken or paneer!
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="p-2 bg-yellow-400 rounded-xl text-indigo-900 shadow-lg shadow-yellow-400/20">
                                    <Star size={18} fill="currentColor" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-300">New Addition</span>
                                    <span className="font-bold text-sm tracking-tight text-white">Ice-cream Sundays!</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-gray-200 shadow-sm">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 block text-center italic">Service Timings</h4>
                        <div className="space-y-4">
                            {[
                                { name: "Breakfast", color: "text-orange-500", bg: "bg-orange-50", time: "07:30 - 09:00 AM" },
                                { name: "Lunch", color: "text-yellow-500", bg: "bg-yellow-50", time: "12:00 - 01:30 PM" },
                                { name: "Snacks", color: "text-emerald-500", bg: "bg-emerald-50", time: "04:30 - 05:30 PM" },
                                { name: "Dinner", color: "text-indigo-500", bg: "bg-indigo-50", time: "07:30 - 09:00 PM" }
                            ].map((t, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${t.color.replace('text', 'bg')}`}></div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{t.name}</span>
                                    </div>
                                    <span className="text-[11px] font-black text-gray-400 font-mono tracking-tighter uppercase">{t.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
