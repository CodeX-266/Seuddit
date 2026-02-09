import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { MessageSquare, Send, User, Clock, ChevronDown, ChevronUp, PenTool } from "lucide-react";

function CommunityDetail() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/community/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
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

    const res = await api.get(`/comments/post/${postId}`);
    setComments((prev) => ({ ...prev, [postId]: res.data }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const createComment = async (postId, commentContent) => {
    await api.post("/comments", { post_id: postId, content: commentContent });
    // Refresh comments
    const res = await api.get(`/comments/post/${postId}`);
    setComments((prev) => ({ ...prev, [postId]: res.data }));
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <MessageSquare size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Community Feed</h1>
            <p className="text-gray-500">Share your thoughts and join the discussion.</p>
          </div>
        </div>

        {/* Create Post Section */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-12 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6 text-indigo-400 font-medium">
            <PenTool size={18} />
            <span>Create New Thread</span>
          </div>
          <form onSubmit={createPost} className="space-y-4">
            <input
              type="text"
              placeholder="What's on your mind?"
              className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600 font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Deep dive into your thoughts..."
              rows="4"
              className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? "Posting..." : "Publish Post"}
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-400 mb-4">
            Recent Discussions
          </h2>
          
          {posts.map((post) => (
            <article key={post.id} className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200">@{post.author || 'Anonymous'}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>Posted recently</span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{post.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6">{post.content}</p>

              <button
                onClick={() => toggleComments(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  expandedComments[post.id] 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <MessageSquare size={16} />
                {expandedComments[post.id] ? "Hide Discussion" : "View Discussion"}
                {expandedComments[post.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="mt-8 pt-8 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 shrink-0">
                        <User size={14} />
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex-1">
                        <p className="text-xs font-bold text-indigo-400 mb-1">{comment.author}</p>
                        <p className="text-sm text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  ))}

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
    <form onSubmit={handleSubmit} className="mt-6 relative">
      <input
        type="text"
        placeholder="Write a thoughtful reply..."
        className="w-full p-4 pr-16 bg-black border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
        <Send size={20} />
      </button>
    </form>
  );
}

export default CommunityDetail;