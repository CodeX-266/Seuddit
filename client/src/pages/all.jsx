import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Users, MessageSquare } from "lucide-react";

function All() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get("/communities");
        setCommunities(res.data);
      } catch (err) {
        console.error("Failed to fetch communities", err);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4">All Communities</h1>
          <p className="text-gray-400">
            Browse and explore every community inside CampusSphere.
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="group bg-white/[0.03] border border-white/10 p-6 rounded-2xl transition-all duration-500 hover:bg-white/[0.06] hover:border-indigo-500/50 hover:-translate-y-1"
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                {community.name}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                {community.description || "No description available."}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {community.post_count || 0} Posts
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default All;