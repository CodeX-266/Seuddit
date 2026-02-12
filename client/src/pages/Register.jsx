import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2, CircleCheck } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[440px]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white mb-6">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Join your campus community on CampusSphere
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Security Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-400 text-xs font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Legal/Trust Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
          <CircleCheck size={14} className="text-green-500" />
          University Data Protection Compliant
        </div>
      </div>
    </div>
  );
}

export default Register;