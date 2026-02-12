import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      setError("The email or password you entered is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        
        {/* Brand Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white mb-6">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Sign in to CampusSphere
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Enter your university credentials to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                University Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-400 text-xs font-medium">
              New to the platform?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-10 text-center text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
          Secure Academic Environment • 2026
        </p>
      </div>
    </div>
  );
}

export default Login;