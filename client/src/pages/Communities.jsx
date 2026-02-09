import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Plus, LayoutGrid, MessageSquare, Info, Send, Search } from "lucide-react";

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/communities");
      setCommunities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createCommunity = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/communities", { name, description });
      setName("");
      setDescription("");
      fetchCommunities();
    } catch (err) {
      alert("Error creating community");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Communities</h1>
            <p className="text-gray-400 text-lg">Manage and explore all campus hubs in one place.</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search communities..." 
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-64 transition-all"
            />
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Sidebar: Create Community Form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-semibold">Start a Hub</h2>
              </div>

              <form onSubmit={createCommunity} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science '27"
                    className="w-full mt-1.5 p-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    placeholder="What's this space for?"
                    rows="4"
                    className="w-full mt-1.5 p-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Launch Community"}
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </aside>

          {/* Main: Community List */}
          <main className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <LayoutGrid size={18} />
              <span className="text-sm font-medium uppercase tracking-widest">Active Communities ({communities.length})</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className="group bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                      <MessageSquare size={20} />
                    </div>
                    <Info size={16} className="text-gray-600 hover:text-gray-400 transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                    {community.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {community.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Enter Space <Plus size={14} className="ml-1 rotate-45" />
                  </div>
                </Link>
              ))}
            </div>

            {communities.length === 0 && (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-500">No communities found. Be the first to start one!</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Communities;