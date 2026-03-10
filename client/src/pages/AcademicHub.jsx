import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
    Search, BookOpen, FileText, Download, GraduationCap,
    Home as HomeIcon, Compass, Search as SearchIcon, Map as MapIcon,
    Plus, Filter, X, Loader2, User, Clock, Check
} from "lucide-react";
import { toast } from "react-toastify";

export default function AcademicHub() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [showUpload, setShowUpload] = useState(false);
    const [uploadData, setUploadData] = useState({
        course_code: "",
        course_name: "",
        category: "PYQ",
        semester: "Winter 2024",
        faculty_name: "",
        description: ""
    });
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Sign in to access study materials!");
            navigate("/login");
            return;
        }
        fetchMaterials();
    }, [searchQuery, activeTab, navigate]);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchQuery) params.query = searchQuery;
            if (activeTab !== "all") params.category = activeTab.toUpperCase();

            const response = await axios.get("/academic", { params });
            setMaterials(response.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            await axios.post("/academic", {
                ...uploadData,
                file_url: "#" // Placeholder since we don't have file upload yet
            });
            setShowUpload(false);
            setUploadData({
                course_code: "", course_name: "", category: "PYQ",
                semester: "Winter 2024", faculty_name: "", description: ""
            });
            fetchMaterials();
            toast.success("Successfully uploaded study material! Thanks for contributing.");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error(error.response?.data?.message || "Upload failed. Check if you're logged in.");
        } finally {
            setUploading(false);
        }
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items - center gap - 3 px - 3 py - 2 rounded - md text - sm font - medium transition - colors ${isActive
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    } `}
            >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {children}
            </Link>
        );
    };

    return (
        <div className="min-h-screen text-gray-900 selection:bg-indigo-100 relative overflow-hidden bg-[#f0f2f5]">

            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            ></div>

            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-8 px-10 py-10 max-w-[1600px] mx-auto h-[calc(100vh-80px)]">

                {/* Left Sidebar */}
                <aside className="hidden md:block md:col-span-2 pl-4">
                    <div className="space-y-8 h-full">
                        <nav className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase text-gray-400 mb-4 tracking-wider px-3">
                                Navigation
                            </p>
                            <NavLink to="/" icon={HomeIcon}>Home</NavLink>
                            <NavLink to="/all" icon={Compass}>Explore</NavLink>
                            <NavLink to="/lost-and-found" icon={SearchIcon}>Lost & Found</NavLink>
                            <NavLink to="/map" icon={MapIcon}>Campus Map</NavLink>
                            <NavLink to="/academic" icon={BookOpen}>Academic Hub</NavLink>
                        </nav>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 text-indigo-600">
                                <GraduationCap size={16} /> Contribute
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                Helped by notes? Pay it forward. Share your study materials with your peers.
                            </p>
                            <button
                                onClick={() => setShowUpload(true)}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <Plus size={16} /> Upload Now
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="md:col-span-7 flex flex-col gap-6">

                    {/* Search & Tabs */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Academic Hub</h1>
                                <p className="text-sm text-gray-500">Subject-wise Notes, PYQs & Materials</p>
                            </div>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search Course Code/Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {["all", "pyq", "notes", "materials"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px - 5 py - 2 rounded - full text - xs font - bold uppercase tracking - wider transition - all whitespace - nowrap
                                        ${activeTab === tab
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        } `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                                <p className="text-gray-500 font-medium">Loading resources...</p>
                            </div>
                        ) : materials.length > 0 ? (
                            materials.map((m) => (
                                <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group">
                                    <div className="flex-grow space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                                                {m.course_code}
                                            </span>
                                            <span className={`text - [10px] font - bold uppercase tracking - widest px - 2 py - 1 rounded
                                                ${m.category === 'PYQ' ? 'bg-orange-50 text-orange-600' : m.category === 'NOTES' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'} `}>
                                                {m.category}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {m.course_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m.description}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
                                            <span className="flex items-center gap-1.5"><User size={14} /> {m.faculty_name || 'Various Faculty'}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {m.semester}</span>
                                        </div>
                                    </div>
                                    <div className="md:border-l border-gray-100 md:pl-6 flex items-center justify-center">
                                        <button
                                            onClick={() => {
                                                if (m.file_url && m.file_url !== "#") {
                                                    window.open(m.file_url, "_blank");
                                                } else {
                                                    alert("This is a sample entry. In the live version, this will download the actual PDF/Image file.");
                                                }
                                            }}
                                            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm hover:scale-105 active:scale-95 shadow-indigo-100"
                                        >
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 text-center px-10">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
                                <p className="text-gray-500 max-w-sm mt-2">Try searching with a different course code or category, or be the first to upload one!</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Panel - Stats/Info */}
                <aside className="hidden md:block md:col-span-3">
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
                            <h3 className="text-lg font-bold mb-2">Subject-Wide Search</h3>
                            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                                Access a vast library of CAT and FAT exam papers, professor-specific notes, and official course materials.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                    <div className="text-xl font-bold">50+</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Daily Uploads</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                    <div className="text-xl font-bold">1k+</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Resources</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest text-center">Top Categories</h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Cloud Computing', count: 124 },
                                    { label: 'OS/Microprocessors', count: 89 },
                                    { label: 'Discrete Maths', count: 156 },
                                    { label: 'Python Systems', count: 42 }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">{item.label}</span>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Plus className="text-indigo-600" /> Share Resource
                            </h2>
                            <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Course Code</label>
                                    <input
                                        type="text" required placeholder="CSE2001"
                                        value={uploadData.course_code}
                                        onChange={e => setUploadData({ ...uploadData, course_code: e.target.value.toUpperCase() })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={uploadData.category}
                                        onChange={e => setUploadData({ ...uploadData, category: e.target.value })}
                                    >
                                        <option value="PYQ">PYQ</option>
                                        <option value="NOTES">Notes</option>
                                        <option value="MATERIALS">Materials</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Course Name</label>
                                <input
                                    type="text" required placeholder="Computer Architecture and Organization"
                                    value={uploadData.course_name}
                                    onChange={e => setUploadData({ ...uploadData, course_name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Semester</label>
                                    <input
                                        type="text" placeholder="Winter 2024"
                                        value={uploadData.semester}
                                        onChange={e => setUploadData({ ...uploadData, semester: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Faculty (Optional)</label>
                                    <input
                                        type="text" placeholder="Dr. S. Ramesh"
                                        value={uploadData.faculty_name}
                                        onChange={e => setUploadData({ ...uploadData, faculty_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                                <textarea
                                    placeholder="Briefly describe the contents (e.g. CAT-2 paper with solutions)"
                                    value={uploadData.description}
                                    onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                ></textarea>
                            </div>
                            <button
                                type="submit" disabled={uploading}
                                className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Publish Material</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
