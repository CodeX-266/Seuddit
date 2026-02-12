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
    <div className="min-h-screen text-gray-900 selection:bg-blue-100 relative overflow-hidden bg-[#f0f2f5]">
      
      {/* Updated Crazy Random Doodle Background */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 20l5 5m-5 0l5-5M40 10l3 7h8l-6 5 2 8-7-5-7 5 2-8-6-5h8zM80 15c0 6-4 10-10 10s-10-4-10-10 4-10 10-10 10 4 10 10zM120 10l10 20-15-5zM20 60s5-10 15-5 15 10 25 5M85 50l10 10m0-10l-10 10M125 65l-8 4 4 8 8-4zM10 110h20M10 118h20M10 126h20M60 110c0 10 15 10 15 0s15-10 15 0M120 120a10 10 0 1 0 20 0 10 10 0 1 0-20 0zM45 85l5-15 5 15-10-10 10 0z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      ></div>

      {/* Content Layer */}
      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 px-10 py-10">
        
        {/* Left Sidebar */}
        <aside className="hidden md:block md:col-span-2 pl-4">
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
        <main className="md:col-span-7 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200">
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
        <aside className="hidden lg:block lg:col-span-3 pr-4">
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