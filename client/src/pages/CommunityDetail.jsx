import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  MessageSquare, Send, User, Clock, ChevronDown, ChevronUp,
  PenTool, ArrowLeft, Loader2, UserPlus, UserMinus, Trash2,
  Shield, Lock
} from "lucide-react";

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Membership state
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

  // Vote tracking (local state after user votes in this session)
  const [postVotes, setPostVotes] = useState({});
  const [commentVotes, setCommentVotes] = useState({});

  /* ── Data Fetching ── */

  const fetchCommunity = async () => {
    try {
      const res = await api.get("/communities");
      const found = res.data.find((c) => c.id === parseInt(id));
      if (found) setCommunity(found);
    } catch (err) {
      console.error("Failed to fetch community", err);
    }
  };

  const fetchMembership = async () => {
    if (!token) return;
    try {
      const res = await api.get(`/communities/${id}/membership`);
      setIsMember(res.data.isMember);
      setMemberRole(res.data.role || null);
    } catch (err) {
      // If endpoint not found or auth fails, default to non-member
      setIsMember(false);
      setMemberRole(null);
    }
  };

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

  /* ── Community Actions ── */

  const joinCommunity = async () => {
    if (!token) return navigate("/login");
    setMembershipLoading(true);
    try {
      await api.post(`/communities/join/${id}`);
      setIsMember(true);
      setMemberRole("member");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join community");
    } finally {
      setMembershipLoading(false);
    }
  };

  const leaveCommunity = async () => {
    setMembershipLoading(true);
    try {
      await api.delete(`/communities/leave/${id}`);
      setIsMember(false);
      setMemberRole(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave community");
    } finally {
      setMembershipLoading(false);
    }
  };

  const deleteCommunity = async () => {
    if (!confirm("Are you sure you want to delete this community? This action cannot be undone.")) return;
    try {
      await api.delete(`/communities/${id}`);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete community");
    }
  };

  /* ── Post Actions ── */

  const createPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/posts", { community_id: id, title, content });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  /* ── Voting ── */

  const voteOnPost = async (postId, voteType) => {
    if (!token) return alert("Please login to vote");
    try {
      const res = await api.post("/votes/post", { post_id: postId, vote_type: voteType });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, vote_score: res.data.vote_score } : p
        )
      );
      setPostVotes((prev) => ({ ...prev, [postId]: voteType }));
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const voteOnComment = async (postId, commentId, voteType) => {
    if (!token) return alert("Please login to vote");
    try {
      const res = await api.post("/votes/comment", { comment_id: commentId, vote_type: voteType });
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.id === commentId ? { ...c, vote_score: res.data.vote_score } : c
        ),
      }));
      setCommentVotes((prev) => ({ ...prev, [commentId]: voteType }));
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  /* ── Comments ── */

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

  /* ── Lifecycle ── */

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
    fetchMembership();
  }, [id]);

  const isOwner = memberRole === "owner";
  const isLoggedIn = !!token;

  /* ── Loading State ── */

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  /* ── Render ── */

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 pb-20">

      {/* Sub-Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 mb-8">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          {/* Membership & Owner Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              isMember ? (
                isOwner ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold">
                      <Shield size={14} />
                      Owner
                    </span>
                    <button
                      onClick={deleteCommunity}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={leaveCommunity}
                    disabled={membershipLoading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {membershipLoading ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
                    Leave
                  </button>
                )
              ) : (
                <button
                  onClick={joinCommunity}
                  disabled={membershipLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {membershipLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Join Community
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-sm font-bold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
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
              <h1 className="text-3xl font-bold tracking-tight">
                {community?.name || "Community Feed"}
              </h1>
              <p className="text-gray-500">
                {community?.description || `Circle ID: ${id} • Active Discussions`}
              </p>
            </div>
          </div>
        </header>

        {/* ── Create Post Section (gated) ── */}
        {isLoggedIn && isMember ? (
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
        ) : isLoggedIn && !isMember ? (
          <section className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 mb-12 text-center">
            <Lock size={32} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">Join to Participate</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              You need to be a member of this community to create posts and comments.
            </p>
            <button
              onClick={joinCommunity}
              disabled={membershipLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              {membershipLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              Join Community
            </button>
          </section>
        ) : (
          <section className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 mb-12 text-center">
            <Lock size={32} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">Sign in to Participate</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Login or register to join communities, create posts, and engage in discussions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-bold text-sm transition-colors"
            >
              Sign In
            </Link>
          </section>
        )}

        {/* ── Posts List ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-8 text-gray-400">
            <Clock size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Recent Activity</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400">No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-gray-300"
              >
                <div className="flex">

                  {/* ── Vote Column ── */}
                  <div className="flex flex-col items-center gap-0.5 py-5 px-3 bg-gray-50/60 border-r border-gray-100 select-none">
                    <button
                      onClick={() => voteOnPost(post.id, "UPVOTE")}
                      className={`p-1.5 rounded-md transition-all ${postVotes[post.id] === "UPVOTE"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      title="Upvote"
                    >
                      <ChevronUp size={22} strokeWidth={2.5} />
                    </button>

                    <span
                      className={`text-sm font-bold min-w-[2ch] text-center tabular-nums ${postVotes[post.id] === "UPVOTE"
                          ? "text-blue-600"
                          : postVotes[post.id] === "DOWNVOTE"
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                    >
                      {post.vote_score || 0}
                    </span>

                    <button
                      onClick={() => voteOnPost(post.id, "DOWNVOTE")}
                      className={`p-1.5 rounded-md transition-all ${postVotes[post.id] === "DOWNVOTE"
                          ? "text-red-500 bg-red-50"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      title="Downvote"
                    >
                      <ChevronDown size={22} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* ── Post Content ── */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          @{post.author || "student_user"}
                        </p>
                        <p className="text-[11px] text-gray-400">posted in general</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                      {post.content}
                    </p>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${expandedComments[post.id]
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                      <MessageSquare size={14} />
                      {expandedComments[post.id] ? "Close Discussion" : "View Comments"}
                      {expandedComments[post.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* ── Comments Section ── */}
                {expandedComments[post.id] && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-6 space-y-5">
                    <div className="space-y-4">
                      {comments[post.id]?.length > 0 ? (
                        comments[post.id].map((comment) => (
                          <div key={comment.id} className="flex gap-3">

                            {/* Comment Vote */}
                            <div className="flex flex-col items-center gap-0 pt-1 select-none">
                              <button
                                onClick={() => voteOnComment(post.id, comment.id, "UPVOTE")}
                                className={`p-0.5 rounded transition-all ${commentVotes[comment.id] === "UPVOTE"
                                    ? "text-blue-600"
                                    : "text-gray-300 hover:text-blue-600"
                                  }`}
                              >
                                <ChevronUp size={14} strokeWidth={2.5} />
                              </button>
                              <span
                                className={`text-[11px] font-bold tabular-nums ${commentVotes[comment.id] === "UPVOTE"
                                    ? "text-blue-600"
                                    : commentVotes[comment.id] === "DOWNVOTE"
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }`}
                              >
                                {comment.vote_score || 0}
                              </span>
                              <button
                                onClick={() => voteOnComment(post.id, comment.id, "DOWNVOTE")}
                                className={`p-0.5 rounded transition-all ${commentVotes[comment.id] === "DOWNVOTE"
                                    ? "text-red-500"
                                    : "text-gray-300 hover:text-red-500"
                                  }`}
                              >
                                <ChevronDown size={14} strokeWidth={2.5} />
                              </button>
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-xs font-bold text-gray-900">{comment.author}</p>
                                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                  Verified Member
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 leading-normal">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No comments yet. Start the conversation!
                        </p>
                      )}
                    </div>

                    {/* Comment Form — gated by membership */}
                    {isLoggedIn && isMember ? (
                      <CommentForm postId={post.id} onSubmit={createComment} />
                    ) : isLoggedIn ? (
                      <p className="text-xs text-gray-400 italic text-center py-2">
                        Join this community to comment
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic text-center py-2">
                        <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>{" "}
                        to comment
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CommentForm({ postId, onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
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