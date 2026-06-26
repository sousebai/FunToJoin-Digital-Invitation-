// ─── ProfilePage.jsx ──────────────────────────────────────────────────────────
// User profile page: avatar, stats, posts grid, follow/unfollow.
// Works for both the logged-in user (/profile) and other users (/profile/:id).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, getMyProfile, followUser, unfollowUser } from '../services/userService';
import { getUserPosts } from '../services/postService';
import EditProfileModal from '../components/Profile/EditProfileModal';
import Sidebar from '../components/Layout/Sidebar';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id: profileUserId } = useParams();   // undefined = own profile
  const { user: currentUser, updateProfileCache } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = !profileUserId || profileUserId === currentUser._id;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // for lightbox

  // ─── Load profile + posts ────────────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const fetchedUser = isOwnProfile
          ? await getMyProfile()
          : await getUserById(profileUserId);
        setProfileUser(fetchedUser);
        setFollowing(fetchedUser.followers?.includes(currentUser._id));

        const userPosts = await getUserPosts(fetchedUser._id);
        setPosts(userPosts || []);
      } catch {
        toast.error('Could not load profile');
        navigate('/feed');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [profileUserId]);

  // ─── Follow / Unfollow ───────────────────────────────────────────────────
  const handleFollowToggle = async () => {
    try {
      if (following) {
        await unfollowUser(profileUser._id);
        setFollowing(false);
        setProfileUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== currentUser._id),
        }));
        toast.success(`Unfollowed ${profileUser.name}`);
      } else {
        await followUser(profileUser._id);
        setFollowing(true);
        setProfileUser((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), currentUser._id],
        }));
        toast.success(`Following ${profileUser.name}!`);
      }
    } catch {
      toast.error('Action failed. Please try again.');
    }
  };

  // ─── Profile update from edit modal ─────────────────────────────────────
  const handleProfileUpdated = (updatedUser) => {
    setProfileUser(updatedUser);
    if (isOwnProfile) updateProfileCache(updatedUser); // update AuthContext too
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Loading state
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar activePage="profile" />
        <main className="profile-main">
          <div className="profile-skeleton">
            <div className="skeleton-circle" />
            <div className="skeleton-line wide" />
            <div className="skeleton-line narrow" />
          </div>
        </main>
      </div>
    );
  }

  const followerCount = profileUser?.followers?.length || 0;
  const followingCount = profileUser?.following?.length || 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Sidebar activePage="profile" />

      <main className="profile-main">
        {/* ── Profile header ────────────────────────────────────────────── */}
        <section className="profile-header">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            {profileUser?.avatar ? (
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {profileUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="profile-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{profileUser?.name}</h1>

              {isOwnProfile ? (
                <button
                  className="btn-secondary"
                  onClick={() => setShowEditModal(true)}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <button
                  className={following ? 'btn-secondary' : 'btn-primary'}
                  onClick={handleFollowToggle}
                >
                  {following ? 'Following ✓' : '+ Follow'}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{followerCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            {/* Bio */}
            {profileUser?.bio && (
              <p className="profile-bio">{profileUser.bio}</p>
            )}
          </div>
        </section>

        {/* ── Posts grid ───────────────────────────────────────────────── */}
        <section className="profile-posts-section">
          <h3 className="profile-posts-title">📸 Posts</h3>

          {posts.length === 0 ? (
            <div className="profile-no-posts">
              <span>🖼️</span>
              <p>No posts yet.</p>
              {isOwnProfile && (
                <p>Share your first moment!</p>
              )}
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="posts-grid-item"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.caption || 'post'} />
                  ) : (
                    <div className="posts-grid-text-preview">
                      <p>{post.caption}</p>
                    </div>
                  )}
                  <div className="posts-grid-overlay">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Post lightbox ─────────────────────────────────────────────── */}
        {selectedPost && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="lightbox-box"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt="post"
                  className="lightbox-image"
                />
              )}
              <div className="lightbox-info">
                <p className="lightbox-caption">{selectedPost.caption}</p>
                <div className="lightbox-actions">
                  <span>❤️ {selectedPost.likes?.length || 0} likes</span>
                  <span>💬 {selectedPost.comments?.length || 0} comments</span>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowEditModal(false)}
          onUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default ProfilePage;
