import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CommunityDetail from "./pages/CommunityDetail";
import Communities from "./pages/Communities";
import LostAndFound from "./pages/LostAndFound";
import CampusMap from "./pages/CampusMap";
import AcademicHub from "./pages/AcademicHub";
import MessMenu from "./pages/MessMenu";
import { LogOut, Map, BookOpen, Utensils } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Clean Minimal Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-gray-900 hover:opacity-80 transition"
          >
            CampusSphere
          </Link>

          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition font-medium">
              Home
            </Link>
            <Link to="/all" className="hover:text-gray-900 transition font-medium">
              Communities
            </Link>
            <Link to="/lost-and-found" className="hover:text-gray-900 transition font-medium">
              Lost & Found
            </Link>
            <Link to="/map" className="hover:text-gray-900 transition font-medium">
              Map
            </Link>
            <Link to="/mess" className="flex items-center gap-1 hover:text-gray-900 transition font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 italic">
              <Utensils size={16} /> Mess
            </Link>
            <Link to="/academic" className="text-indigo-600 hover:text-indigo-900 transition font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1.5 shadow-sm">
              <BookOpen size={16} /> Academics
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
                toast.info("Logged out successfully! Come back soon.");
                navigate("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-gray-300 rounded-lg text-white bg-gray-900 hover:bg-gray-800 hover:text-white transition shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<Communities />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/academic" element={<AcademicHub />} />
          <Route path="/mess" element={<MessMenu />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;
