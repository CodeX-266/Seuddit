import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { MessageSquare, Send, User, Clock, ChevronDown, ChevronUp, PenTool, ArrowLeft, Loader2 } from "lucide-react";

function CommunityDetail() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/community/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPageLoading(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/posts", { community_id: id, title, content });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments((prev) => ({ ...prev, [postId]: false }));
      return;
    }

    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const createComment = async (postId, commentContent) => {
    try {
      await api.post("/comments", { post_id: postId, content: commentContent });
      const res = await api.get(`/comments/post/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 pb-20">
      {/* Top Nav Bar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 mb-8">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} />
            Back to Communities
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        {/* Community Identity */}
        <header className="mb-12">
          <div className="flex items-center gap-5 mb-4">
            <div className="h-14 w-14 rounded-xl bg-gray-900 flex items-center justify-center text-white">
              <MessageSquare size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Community Feed</h1>
              <p className="text-gray-500">Circle ID: {id} • Active Discussions</p>
            </div>
          </div>
        </header>

        {/* Create Post Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            <PenTool size={14} />
            <span>Start a new thread</span>
          </div>
          <form onSubmit={createPost} className="space-y-4">
            <input
              type="text"
              placeholder="Topic title"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="What would you like to discuss?"
              rows="3"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post to Feed"}
                <Send size={16} />
              </button>
            </div>
          </form>
        </section>

        {/* Posts List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-8 text-gray-400">
            <Clock size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Recent Activity</span>
          </div>
          
          {posts.map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-gray-300">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">@{post.author || 'student_user'}</p>
                    <p className="text-[11px] text-gray-400">posted in general</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight">{post.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">{post.content}</p>

                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    expandedComments[post.id] 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare size={14} />
                  {expandedComments[post.id] ? "Close Discussion" : "View Comments"}
                  {expandedComments[post.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 space-y-6">
                  <div className="space-y-4">
                    {comments[post.id]?.length > 0 ? (
                      comments[post.id].map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                            <User size={12} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <p className="text-xs font-bold text-gray-900">{comment.author}</p>
                              <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Verified Member</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-normal">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No comments yet. Start the conversation!</p>
                    )}
                  </div>

                  <CommentForm postId={post.id} onSubmit={createComment} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentForm({ postId, onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postId, text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 relative">
      <input
        type="text"
        placeholder="Reply to this thread..."
        className="w-full py-2.5 pl-4 pr-12 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-all">
        <Send size={16} />
      </button>
    </form>
  );
}

export default CommunityDetail;