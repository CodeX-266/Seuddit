import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import {
    Search, MapPin, Store, Coffee, Scissors, Shirt,
    Home as HomeIcon, Compass, FileText, Info, X,
    Printer, Utensils, Zap, Map as MapIcon, LocateFixed
} from "lucide-react";

// Fix default leafet markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const createPin = (colorClass, label) => `
  <div class="relative flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="${colorClass} w-10 h-10 drop-shadow-md z-10 transition-transform hover:scale-110">
      <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
    </svg>
    <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-[11px] bg-white/95 px-2 py-0.5 rounded shadow-sm border border-gray-200 text-gray-800 z-20 pointer-events-none mt-0.5">
        ${label}
    </div>
  </div>
`;

// Dynamic Icons for different types of buildings
const customIcons = {
    academic: (name) => L.divIcon({ className: 'bg-transparent border-0', html: createPin('text-blue-500', name), iconSize: [40, 40], iconAnchor: [20, 36] }),
    hostel: (name) => L.divIcon({ className: 'bg-transparent border-0', html: createPin('text-emerald-500', name), iconSize: [40, 40], iconAnchor: [20, 36] }),
    amenity: (name) => L.divIcon({ className: 'bg-transparent border-0', html: createPin('text-orange-500', name), iconSize: [40, 40], iconAnchor: [20, 36] }),
    admin: (name) => L.divIcon({ className: 'bg-transparent border-0', html: createPin('text-purple-500', name), iconSize: [40, 40], iconAnchor: [20, 36] })
};

// Map center for VIT Chennai
const VIT_CHENNAI_CENTER = [12.8406, 80.1534];

// Real World Lat/Lng approximation for VIT Chennai structures
const campusData = [
    {
        id: "ab1",
        name: "Academic Block 1 (AB1)",
        type: "academic",
        lat: 12.8436765,
        lng: 80.1535132,
        color: "bg-blue-500",
        shops: [
            { name: "Foodys", category: "Food & Beverages", icon: Coffee },
            { name: "AB1 Xerox", category: "Printing & Stationery", icon: Printer },
            { name: "Nescafe Kiosk", category: "Food & Beverages", icon: Coffee }
        ],
        description: "Oldest Academic Block hosting computing labs and tech offices."
    },
    {
        id: "ab2",
        name: "Academic Block 2 (AB2)",
        type: "academic",
        lat: 12.8427736,
        lng: 80.156555,
        color: "bg-blue-600",
        shops: [
            { name: "Enzo", category: "Food & Beverages", icon: Utensils },
            { name: "AB2 Stationery", category: "Printing & Stationery", icon: Printer }
        ],
        description: "Core engineering and science block."
    },
    {
        id: "ab3",
        name: "Academic Block 3 (AB3)",
        type: "academic",
        lat: 12.8438127,
        lng: 80.1548179,
        color: "bg-blue-400",
        shops: [
            { name: "Domino's Mini", category: "Food & Beverages", icon: Utensils },
            { name: "AB3 Xerox", category: "Printing & Stationery", icon: Printer }
        ],
        description: "Newest Academic Block primarily for law and fashion schools."
    },
    {
        id: "ab4",
        name: "Academic Block 4 (AB4)",
        type: "academic",
        lat: 12.8429841,
        lng: 80.1556488,
        color: "bg-blue-700",
        shops: [
            { name: "Snack Shack", category: "Food & Beverages", icon: Coffee }
        ],
        description: "Fourth academic block with modern classrooms."
    },
    {
        id: "food-street",
        name: "Gazebo / Food Street",
        type: "amenity",
        lat: 12.8415758,
        lng: 80.1548365,
        color: "bg-orange-500",
        shops: [
            { name: "Amul Parlour", category: "Food & Beverages", icon: Coffee },
            { name: "Fruit Juice Shop", category: "Food & Beverages", icon: Zap },
            { name: "Shawarma Center", category: "Food & Beverages", icon: Utensils },
            { name: "South Indian Mess", category: "Food & Beverages", icon: Utensils },
            { name: "Campus Supermarket", category: "Groceries", icon: Store }
        ],
        description: "The central food hub near the library and admin block."
    },
    {
        id: "bh",
        name: "Boys Hostels (D1/D2)",
        type: "hostel",
        lat: 12.8438,
        lng: 80.1518,
        color: "bg-emerald-500",
        shops: [
            { name: "BH Night Canteen", category: "Food & Beverages", icon: Utensils },
            { name: "Quick Xerox", category: "Printing & Stationery", icon: Printer },
            { name: "Domino's", category: "Food & Beverages", icon: Utensils },
            { name: "Dhobi / Laundry", category: "Services", icon: Shirt }
        ],
        description: "Men's residential blocks with integrated night facilities."
    },
    {
        id: "gh",
        name: "Girls Hostels",
        type: "hostel",
        lat: 12.8419736,
        lng: 80.1572402,
        color: "bg-emerald-400",
        shops: [
            { name: "GH Night Canteen", category: "Food & Beverages", icon: Utensils },
            { name: "GH Xerox & Stationery", category: "Printing & Stationery", icon: Printer },
            { name: "Beauty Parlour", category: "Services", icon: Scissors }
        ],
        description: "Women's residential blocks with dedicated amenities."
    },
    {
        id: "admin",
        name: "Administrative Block",
        type: "admin",
        lat: 12.8406104,
        lng: 80.1539712,
        color: "bg-purple-500",
        shops: [
            { name: "Indian Bank", category: "Bank & ATM", icon: Store },
            { name: "Post Office", category: "Services", icon: FileText }
        ],
        description: "Admissions, finance, and central administration offices."
    },
    {
        id: "pool",
        name: "VIT Swimming Pool",
        type: "amenity",
        lat: 12.8408837,
        lng: 80.1565054,
        color: "bg-cyan-500",
        shops: [],
        description: "Standard size campus swimming pool."
    }
];

// Helper Component to Recenter Map on Selected Building
const FocusMap = ({ selectedBuildingId }) => {
    const map = useMap();
    useEffect(() => {
        if (selectedBuildingId) {
            const b = campusData.find(x => x.id === selectedBuildingId);
            if (b) {
                map.flyTo([b.lat, b.lng], 18, { animate: true, duration: 1.5 });
            }
        }
    }, [selectedBuildingId, map]);
    return null;
};

export default function CampusMap() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBuildingId, setSelectedBuildingId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Please sign in to access the Campus Map!");
            navigate("/login");
        }
    }, [navigate]);

    // Search Logic
    const matchingBuildings = useMemo(() => {
        if (!searchQuery.trim()) return campusData.map(b => b.id);
        const query = searchQuery.toLowerCase();
        return campusData.filter(b => {
            const matchName = b.name.toLowerCase().includes(query);
            const matchShops = b.shops.some(s =>
                s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query)
            );
            return matchName || matchShops;
        }).map(b => b.id);
    }, [searchQuery]);

    const selectedBuilding = campusData.find(b => b.id === selectedBuildingId);

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
        <div className="min-h-screen text-gray-900 selection:bg-indigo-100 relative overflow-hidden bg-[#f0f2f5]">
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 px-10 py-10 max-w-[1600px] mx-auto h-[calc(100vh-80px)]">

                {/* Left Sidebar */}
                <aside className="hidden md:block md:col-span-2 pl-4">
                    <div className="space-y-8 h-full">
                        <nav className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase text-gray-400 mb-4 tracking-wider px-3">
                                Discover
                            </p>
                            <NavLink to="/" icon={HomeIcon}>Home</NavLink>
                            <NavLink to="/all" icon={Compass}>Explore</NavLink>
                            <NavLink to="/lost-and-found" icon={Search}>Lost & Found</NavLink>
                            <NavLink to="/map" icon={MapIcon}>Campus Map</NavLink>
                        </nav>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Info size={16} className="text-indigo-500" /> Map Legend
                            </h3>
                            <div className="space-y-3 text-xs font-medium text-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm border border-white"></div>
                                    <span>Academic Blocks</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border border-white"></div>
                                    <span>Hostels</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm border border-white"></div>
                                    <span>Food & Amenities</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm border border-white"></div>
                                    <span>Administration</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Interactive Map Area */}
                <main className="md:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative h-[80vh] md:h-auto">

                    {/* Top Search Bar */}
                    <div className="p-4 border-b border-gray-100 bg-white z-20 flex justify-between items-center gap-4 shadow-sm shrink-0">
                        <div className="relative flex-grow max-w-xl">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search for Xerox, Amul, Laundry, AB1..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="hidden sm:block text-xs font-bold uppercase tracking-wider text-gray-400">
                            VIT Chennai
                        </div>
                    </div>

                    {/* Actual Google-Map-like experience using Leaflet */}
                    <div className="flex-grow relative bg-[#e5e5e5] z-0">
                        <MapContainer
                            center={VIT_CHENNAI_CENTER}
                            zoom={16}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", position: "absolute", zIndex: 0 }}
                            zoomControl={false}
                        >
                            {/* Realistic Map Tiles overlay - using OpenStreetMap for free Google Maps feel */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <ZoomControl position="bottomright" />
                            <FocusMap selectedBuildingId={selectedBuildingId} />

                            {campusData.map((building) => {
                                const isSearched = matchingBuildings.includes(building.id);
                                const isSelected = selectedBuildingId === building.id;

                                // Opacity check for filtering
                                const opacity = (searchQuery && !isSearched) ? 0.3 : 1.0;

                                return (
                                    <Marker
                                        key={building.id}
                                        position={[building.lat, building.lng]}
                                        icon={customIcons[building.type] ? customIcons[building.type](building.name) : customIcons.academic(building.name)}
                                        eventHandlers={{
                                            click: () => {
                                                setSelectedBuildingId(building.id);
                                            },
                                        }}
                                        opacity={opacity}
                                    >
                                        <Popup>
                                            <div className="font-sans">
                                                <h3 className="font-bold text-gray-900">{building.name}</h3>
                                                <p className="text-xs text-gray-500 mb-2">{building.shops.length} listed places</p>
                                                <button
                                                    onClick={() => setSelectedBuildingId(building.id)}
                                                    className="w-full bg-indigo-600 text-white py-1 px-2 rounded hover:bg-indigo-700 text-xs font-medium transition"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </MapContainer>
                    </div>
                </main>

                {/* Right Panel - Details */}
                <aside className="md:col-span-3 flex flex-col h-[80vh] md:h-auto">
                    {selectedBuilding ? (
                        <div className="bg-white rounded-2xl shadow-md border border-indigo-100 flex flex-col h-full overflow-hidden animate-fade-in-up">
                            {/* Building Header */}
                            <div className={`p-6 ${selectedBuilding.color} text-white relative`}>
                                <button
                                    onClick={() => setSelectedBuildingId(null)}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-full"
                                >
                                    <X size={18} />
                                </button>
                                <div className="inline-flex items-center justify-center p-2.5 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
                                    <MapPin size={24} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold leading-tight mb-2 pr-6 items-baseline flex gap-2">
                                    {selectedBuilding.name}
                                </h2>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {selectedBuilding.description}
                                </p>
                            </div>

                            {/* Shops List */}
                            <div className="p-6 flex-grow overflow-y-auto bg-gray-50/50">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                                    <Store size={14} /> Directory ({selectedBuilding.shops.length})
                                </h3>

                                {selectedBuilding.shops.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedBuilding.shops.map((shop, idx) => {
                                            const matchesSearch = searchQuery && (shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || shop.category.toLowerCase().includes(searchQuery.toLowerCase()));
                                            const IconComponent = shop.icon || Store;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`bg-white p-4 rounded-xl shadow-sm border transition-all ${matchesSearch ? 'border-indigo-400 ring-1 ring-indigo-400 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-2.5 rounded-lg flex-shrink-0 ${matchesSearch ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                                            <IconComponent size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 leading-tight mb-1">{shop.name}</h4>
                                                            <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                                                {shop.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 text-sm font-medium">No shops listed for this location.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white to-gray-50">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <LocateFixed size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Campus Navigator</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Pan and zoom the real map! Select any building marker to explore its available shops, canteens, and amenities.
                            </p>

                            {searchQuery && matchingBuildings.length > 0 && (
                                <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-fade-in-up text-left">
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Search Results</p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                        {matchingBuildings.map(id => {
                                            const b = campusData.find(x => x.id === id);
                                            return (
                                                <button
                                                    key={b.id}
                                                    onClick={() => setSelectedBuildingId(b.id)}
                                                    className="w-full text-left px-3 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold text-gray-800 hover:text-indigo-600 hover:ring-1 hover:ring-indigo-300 transition-all flex items-center justify-between group"
                                                >
                                                    {b.name}
                                                    <Store size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {searchQuery && matchingBuildings.length === 0 && (
                                <div className="text-red-500 text-sm font-medium border border-red-200 bg-red-50 p-3 rounded-lg w-full">
                                    No buildings found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </aside>

            </div>
        </div>
    );
}
