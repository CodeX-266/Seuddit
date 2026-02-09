import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowRight, Users, MessageSquare, Globe } from "lucide-react"; // Optional: npm i lucide-react

function Home() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get("/communities");
        setCommunities(res.data);
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-400 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Connecting Campus Life
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
          CampusSphere
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed mb-10">
          A unified ecosystem for structured discussions, transparent
          communication, and institutional clarity.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all">
            Get Started
          </button>
          <button className="px-8 py-3 bg-white/5 border border-white/10 font-semibold rounded-full hover:bg-white/10 transition-all">
            Documentation
          </button>
        </div>
      </section>

      {/* Communities Section */}
      <section className="max-w-6xl mx-auto px-6 pb-32 relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Communities</h2>
            <p className="text-gray-500">Join the conversation in your favorite circles.</p>
          </div>
          <Link to="/all" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-medium transition-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="group relative bg-white/[0.03] border border-white/10 p-6 rounded-2xl transition-all duration-500 hover:bg-white/[0.06] hover:border-indigo-500/50 hover:-translate-y-1"
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                {community.name}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                {community.description || "No description provided for this community."}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} /> 24 Posts
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={14} /> Public
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;