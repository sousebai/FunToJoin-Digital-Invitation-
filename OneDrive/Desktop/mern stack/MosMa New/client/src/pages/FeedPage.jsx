// ─── FeedPage.jsx ─────────────────────────────────────────────────────────────
// Step 5: Social Feed Page
// ─────────────────────────────────────────────────────────────────────────────
// Features:
//  • Infinite scrolling feed of posts from followed users
//  • Create Post button (modal with image upload)
//  • Like / unlike with optimistic UI
//  • Comment thread per post
//  • Loading skeletons
//  • Empty state prompt
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFeed } from '../services/postService';
import PostCard from '../components/Feed/PostCard';
import CreatePostModal from '../components/Feed/CreatePostModal';
import Sidebar from '../components/Layout/Sidebar';
import toast from 'react-hot-toast';

const FeedPage = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // ─── Fetch feed page ────────────────────────────────────────────────────
  const fetchFeed = useCallback(async (pageNum) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getFeed(pageNum);
      const newPosts = data.posts || [];
      setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(pageNum < (data.totalPages || 1));
    } catch {
      toast.error('Could not load feed');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial load
  useEffect(() => {
    fetchFeed(1);
  }, []);

  // ─── Infinite scroll via IntersectionObserver ────────────────────────────
  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchFeed(nextPage);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, fetchFeed]);

  // ─── New post prepended to feed ──────────────────────────────────────────
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Sidebar activePage="feed" />

      <main className="feed-main">
        {/* Create post bar */}
        <div className="create-post-bar">
          <div className="create-post-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <button
            className="create-post-trigger"
            onClick={() => setShowCreateModal(true)}
          >
            What's on your mind, {user?.name?.split(' ')[0]}?
          </button>
          <button
            className="create-post-img-btn"
            onClick={() => setShowCreateModal(true)}
            title="Share a photo"
          >
            📷
          </button>
        </div>

        {/* Feed posts */}
        <div className="feed-posts">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={user._id}
            />
          ))}

          {/* Loading skeletons */}
          {loading && (
            <>
              <div className="post-skeleton" />
              <div className="post-skeleton" />
            </>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <div className="feed-empty">
              <div className="feed-empty-icon">🌱</div>
              <h3>Your feed is empty</h3>
              <p>Follow people or create your first post to get started!</p>
              <button
                className="btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Post
              </button>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {/* End of feed */}
          {!hasMore && posts.length > 0 && (
            <p className="feed-end">✓ You're all caught up!</p>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default FeedPage;
