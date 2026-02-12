import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CommunityDetail from "./pages/CommunityDetail";
import Communities from "./pages/Communities";
import { LogOut } from "lucide-react";

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

      {/* Clean Minimal Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-gray-900 hover:opacity-80 transition"
          >
            CampusSphere
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition">
              Home
            </Link>
            <Link to="/all" className="hover:text-gray-900 transition">
              Explore
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
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
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;
