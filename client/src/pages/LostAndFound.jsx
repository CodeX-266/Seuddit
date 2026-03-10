import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, MapPin, Tag, CheckCircle, Clock, Home as HomeIcon, Compass, Search } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("lost");
    const [category, setCategory] = useState("Electronics");
    const [itemLocation, setItemLocation] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    const categories = ["Electronics", "Accessories", "Books & Notes", "Clothing", "Other"];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Sign in to check Lost & Found items!");
            navigate("/login");
            return;
        }
        fetchItems();
    }, [navigate]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get("/lost-and-found");
            setItems(res.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch items. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { title, description, type, category, location: itemLocation, contact_info: contactInfo };
            await api.post("/lost-and-found", payload);
            setShowForm(false);
            resetForm();
            fetchItems();
            toast.success("Successfully reported item!");
        } catch (err) {
            console.error("Failed to post article", err);
            toast.error(err.response?.data?.message || "Login to report lost/found items.");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("lost");
        setCategory("Electronics");
        setItemLocation("");
        setContactInfo("");
    };

    const handleResolve = async (id) => {
        try {
            await api.patch(`/lost-and-found/${id}/resolve`);
            fetchItems();
            toast.success("Item marked as resolved!");
        } catch (err) {
            console.error("Failed to resolve item", err);
            toast.error(err.response?.data?.message || "Only the creator can resolve this post.");
        }
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
            >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {children}
            </Link>
        );
    };

    return (
        <div className="min-h-screen text-gray-900 selection:bg-blue-100 relative overflow-hidden bg-[#f0f2f5]">

            {/* Crazy Random Doodle Background matching Home */}
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 20l5 5m-5 0l5-5M40 10l3 7h8l-6 5 2 8-7-5-7 5 2-8-6-5h8zM80 15c0 6-4 10-10 10s-10-4-10-10 4-10 10-10 10 4 10 10zM120 10l10 20-15-5zM20 60s5-10 15-5 15 10 25 5M85 50l10 10m0-10l-10 10M125 65l-8 4 4 8 8-4zM10 110h20M10 118h20M10 126h20M60 110c0 10 15 10 15 0s15-10 15 0M120 120a10 10 0 1 0 20 0 10 10 0 1 0-20 0zM45 85l5-15 5 15-10-10 10 0z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            ></div>

            {/* Content Layer */}
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 px-10 py-10 max-w-[1600px] mx-auto">

                {/* Left Sidebar */}
                <aside className="hidden md:block md:col-span-2 pl-4">
                    <div className="sticky top-10 space-y-8">
                        <nav className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase text-gray-400 mb-4 tracking-wider px-3">
                                Feeds
                            </p>
                            <NavLink to="/" icon={HomeIcon}>Home</NavLink>
                            <NavLink to="/all" icon={Compass}>Explore</NavLink>
                            <NavLink to="/lost-and-found" icon={Search}>Lost & Found</NavLink>
                        </nav>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800 transition shadow-sm"
                        >
                            <Plus size={16} />
                            {showForm ? "Cancel Report" : "Report Item"}
                        </button>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="md:col-span-7 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 min-h-[60vh]">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Lost & Found
                        </h1>
                        <p className="text-gray-500 mt-1 font-serif">
                            Help your campus mates by reporting lost or found items.
                        </p>
                    </div>

                    {showForm && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-5">Report an Item</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="col-span-1 md:col-span-2 space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700">Item Type</label>
                                        <div className="flex gap-3">
                                            <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                                                <input type="radio" name="type" value="lost" checked={type === "lost"} onChange={() => setType("lost")} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                                <span className="text-red-900 font-medium text-sm">I Lost Something</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-4 py-2 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                                                <input type="radio" name="type" value="found" checked={type === "found"} onChange={() => setType("found")} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                                                <span className="text-green-900 font-medium text-sm">I Found Something</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Title <span className="text-red-500">*</span></label>
                                        <input required type="text" placeholder="e.g. Blue Hydroflask" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all text-sm" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all text-sm bg-white">
                                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</label>
                                        <input type="text" placeholder="e.g. Student Union Center" value={itemLocation} onChange={(e) => setItemLocation(e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all text-sm" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact Info</label>
                                        <input type="text" placeholder="e.g. Email or Phone" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all text-sm" />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Description <span className="text-red-500">*</span></label>
                                        <textarea required rows="3" placeholder="Provide distinct features to identify..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all text-sm resize-none"></textarea>
                                    </div>
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <button type="submit" className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-md shadow-sm transition-colors duration-200">
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg border border-red-100 font-medium text-sm">
                                {error}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-400">No items reported. Everything is safe!</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className={`group block border bg-white rounded-lg p-5 transition-all hover:border-gray-400 hover:shadow-sm ${item.status === 'resolved' ? 'border-green-200 opacity-60' : 'border-gray-200 mb-4'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {item.type}
                                            </span>
                                            {item.status === 'resolved' && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded">
                                                    <CheckCircle size={12} /> Resolved
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                        {item.title}
                                    </h2>

                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <div className="flex items-center gap-1.5"><Tag size={14} className="text-gray-400" /> <span className="font-medium">{item.category}</span></div>
                                        {item.location && <div className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> <span>{item.location}</span></div>}
                                        {item.contact_info && <div className="flex items-center gap-1.5"><span className="font-bold text-gray-400">@</span> <span>{item.contact_info}</span></div>}
                                    </div>

                                    {item.status !== 'resolved' && (
                                        <button
                                            onClick={() => handleResolve(item.id)}
                                            className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline transition-all flex items-center gap-1"
                                        >
                                            <CheckCircle size={14} /> Mark as Resolved
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>

                {/* Right Panel matching Home */}
                <aside className="hidden lg:block lg:col-span-3 pr-4">
                    <div className="sticky top-10 space-y-6">
                        <section className="bg-white border border-gray-200 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">
                                Lost & Found Policy
                            </h3>
                            <div className="text-[13px] text-gray-600 space-y-3 leading-relaxed">
                                <p>
                                    Only report genuine lost or found items. Please include details, accurate locations, and valid contact information so peers can reach you.
                                </p>
                                <div className="pt-3 border-t border-gray-100 text-xs">
                                    <p className="text-gray-500 italic">"Finders keepers" does not apply to campus ID cards or electronics!</p>
                                </div>
                            </div>
                        </section>

                        <footer className="px-2 text-[11px] text-gray-400 flex flex-wrap gap-x-3 gap-y-1 uppercase tracking-widest">
                            <a href="#" className="hover:text-gray-600">Privacy</a>
                            <a href="#" className="hover:text-gray-600">Terms</a>
                            <a href="#" className="hover:text-gray-600">Guidelines</a>
                            <span>© 2026</span>
                        </footer>
                    </div>
                </aside>

            </div>
        </div>
    );
}

