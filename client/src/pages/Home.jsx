import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { MessageSquare, Users, Home as HomeIcon, Compass, Plus } from "lucide-react";

function Home() {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get("/communities");
        setCommunities(res.data);
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  // Simple Nav Link component for reusability and active states
  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive 
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
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 px-6 py-10">
        
        {/* Left Sidebar */}
        <aside className="hidden md:block md:col-span-2">
          <div className="sticky top-10 space-y-8">
            <nav className="space-y-1">
              <p className="text-[11px] font-semibold uppercase text-gray-400 mb-4 tracking-wider px-3">
                Feeds
              </p>
              <NavLink to="/" icon={HomeIcon}>Home</NavLink>
              <NavLink to="/all" icon={Compass}>Explore</NavLink>
            </nav>

            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-md text-sm font-medium hover:border-gray-300 transition shadow-sm">
              <Plus size={16} />
              New Circle
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="md:col-span-7">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Communities
            </h1>
            <p className="text-gray-500 mt-1 font-serif">
              Discover student-led discussions and shared interests.
            </p>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              // Skeleton Loader
              [1, 2, 3].map((n) => (
                <div key={n} className="h-28 w-full bg-gray-200 animate-pulse rounded-lg" />
              ))
            ) : communities.length > 0 ? (
              communities.map((community) => (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className="group block border border-gray-200 bg-white rounded-lg p-5 transition-all hover:border-gray-400 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="max-w-[80%]">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {community.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                        {community.description || "Connect with peers in this space."}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-gray-400">
                      <div className="flex items-center gap-1.5 text-[13px]">
                        <span className="font-medium text-gray-600">{community.member_count || 0}</span>
                        <Users size={14} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px]">
                        <span className="font-medium text-gray-600">{community.post_count || 0}</span>
                        <MessageSquare size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-400">No communities found.</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Panel */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-10 space-y-6">
            <section className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                About CampusSphere
              </h3>
              <div className="text-[13px] text-gray-600 space-y-3 leading-relaxed">
                <p>
                  A minimal space for campus-wide coordination and deep-dive discussions.
                </p>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
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

export default Home;