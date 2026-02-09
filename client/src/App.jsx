import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CommunityDetail from "./pages/CommunityDetail";
import Communities from "./pages/Communities"; // Import the communities list page
import { LogOut, User, LayoutGrid, Zap } from "lucide-react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-80 transition"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={18} fill="white" />
            </div>
            <span>CampusSphere</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/all" className="hover:text-white transition-colors">Explore</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/all" 
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Communities"
              >
                <LayoutGrid size={20} />
              </Link>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold border border-red-500/20"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<Communities />} /> {/* Added this missing route */}
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {/* Footer (Optional addition) */}
      <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5">
        &copy; 2026 CampusSphere. Built for the modern student.
      </footer>
    </div>
  );
}

export default App;