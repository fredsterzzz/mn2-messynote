import React from 'react';
import { User, Bell, Shield, CreditCard, Loader2, BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { createPortalSession } from '../services/stripe';
import BackButton from '../components/BackButton';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
}

function Settings() {
  const { user } = useAuth();
  const { credits, loading, resetCredits } = useCredits();
  const [isLoadingPortal, setIsLoadingPortal] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const isAdmin = user?.email === 'fredsterzzz@gmail.com';

  const handleBillingPortal = async () => {
    if (!user) return;
    
    setIsLoadingPortal(true);
    try {
      await createPortalSession(user.id);
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleResetCredits = async () => {
    setIsResetting(true);
    try {
      await resetCredits();
    } catch (error) {
      console.error('Reset error:', error);
      alert('Failed to reset credits. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  // Fetch blog posts
  React.useEffect(() => {
    if (!isAdmin) return;

    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchBlogPosts();
  }, [isAdmin]);

  const handleCreatePost = () => {
    if (!isAdmin) return;
    setSelectedPost(null);
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    if (!isAdmin) return;
    setSelectedPost(post);
    setIsEditing(true);
  };

  const handleDeletePost = async (postId: number) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      setBlogPosts(posts => posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    if (!isAdmin) return;
    try {
      if (selectedPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', selectedPost.id);

        if (error) throw error;
        setBlogPosts(posts => posts.map(post => 
          post.id === selectedPost.id ? { ...post, ...postData } : post
        ));
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select();

        if (error) throw error;
        if (data) setBlogPosts(posts => [...posts, data[0]]);
      }
      setIsEditing(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton to="/dashboard" label="Back to Dashboard" />

      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          Settings
        </span>
      </h1>

      {/* Profile Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold text-text-primary">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
              value={user?.email || ''}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Blog Management */}
      {isAdmin && (
        <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-accent-purple mr-2" />
              <h2 className="text-xl font-semibold text-text-primary">Blog Management</h2>
            </div>
            <button
              onClick={handleCreatePost}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                defaultValue={selectedPost?.title}
                className="w-full px-4 py-2 bg-background border border-accent-purple/20 rounded-lg focus:border-accent-purple focus:ring-1 focus:ring-accent-purple"
                onChange={e => setSelectedPost(prev => prev ? { ...prev, title: e.target.value } : { title: e.target.value } as BlogPost)}
              />
              <input
                type="text"
                placeholder="Category"
                defaultValue={selectedPost?.category}
                className="w-full px-4 py-2 bg-background border border-accent-purple/20 rounded-lg focus:border-accent-purple focus:ring-1 focus:ring-accent-purple"
                onChange={e => setSelectedPost(prev => prev ? { ...prev, category: e.target.value } : { category: e.target.value } as BlogPost)}
              />
              <textarea
                placeholder="Post Excerpt"
                defaultValue={selectedPost?.excerpt}
                className="w-full px-4 py-2 bg-background border border-accent-purple/20 rounded-lg focus:border-accent-purple focus:ring-1 focus:ring-accent-purple h-20"
                onChange={e => setSelectedPost(prev => prev ? { ...prev, excerpt: e.target.value } : { excerpt: e.target.value } as BlogPost)}
              />
              <textarea
                placeholder="Post Content (HTML)"
                defaultValue={selectedPost?.content}
                className="w-full px-4 py-2 bg-background border border-accent-purple/20 rounded-lg focus:border-accent-purple focus:ring-1 focus:ring-accent-purple h-64"
                onChange={e => setSelectedPost(prev => prev ? { ...prev, content: e.target.value } : { content: e.target.value } as BlogPost)}
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedPost(null);
                  }}
                  className="px-4 py-2 border border-accent-purple/20 rounded-lg hover:border-accent-purple/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSavePost(selectedPost || {})}
                  className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Post
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isLoadingPosts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
                </div>
              ) : blogPosts.length === 0 ? (
                <p className="text-center text-text-secondary py-8">No blog posts yet. Create your first post!</p>
              ) : (
                blogPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-accent-purple/20">
                    <div>
                      <h3 className="font-semibold mb-1">{post.title}</h3>
                      <p className="text-sm text-text-secondary">{post.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-text-secondary hover:text-accent-purple transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-text-secondary">Receive updates about your projects</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => {}}
            className="w-full px-4 py-2 text-left bg-background border border-accent-purple/20 rounded-lg hover:border-accent-purple/40 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Billing Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold">Billing Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <h3 className="font-medium mb-1">Available Credits</h3>
              <p className="text-2xl font-bold text-accent-purple">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  credits
                )}
              </p>
            </div>
            <button
              onClick={handleResetCredits}
              disabled={isResetting}
              className="px-4 py-2 bg-background border border-accent-purple/20 rounded-lg hover:border-accent-purple/40 transition-colors disabled:opacity-50"
            >
              {isResetting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Reset Credits'
              )}
            </button>
          </div>
          <button
            onClick={handleBillingPortal}
            disabled={isLoadingPortal}
            className="w-full px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoadingPortal ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              'Manage Subscription'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;