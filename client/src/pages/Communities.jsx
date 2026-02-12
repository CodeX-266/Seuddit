import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Plus, LayoutGrid, MessageSquare, Search, ArrowUpRight, Loader2 } from "lucide-react";

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/communities");
      setCommunities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCommunity = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/communities", { name, description });
      setName("");
      setDescription("");
      fetchCommunities();
    } catch (err) {
      alert("Error creating community");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header: Title and Search */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Communities</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage existing circles or launch a new campus hub.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Sidebar: Create Community Form */}
          <aside className="lg:col-span-4">
            <div className="sticky top-10 bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Start a Hub</h2>
              </div>

              <form onSubmit={createCommunity} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Community Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Design Systems"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    placeholder="Define the purpose of this space..."
                    rows="4"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Launch Community
                </button>
              </form>
            </div>
          </aside>

          {/* Main: Community List */}
          <main className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <LayoutGrid size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Active Communities ({filteredCommunities.length})</span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredCommunities.map((community) => (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="group flex flex-col justify-between bg-white border border-gray-200 p-6 rounded-xl transition-all hover:border-gray-400 hover:shadow-md"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                          <MessageSquare size={20} />
                        </div>
                        <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {community.name}
                      </h3>
                      
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {community.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-4 border-t border-gray-50 pt-4">
                       <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                         View Analytics
                       </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && filteredCommunities.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-400 font-medium">No communities match your criteria.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default Communities;