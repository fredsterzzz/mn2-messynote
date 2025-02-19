import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Eye, Calendar } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published: boolean;
  published_at: string;
  tags: string[];
  meta_description: string;
}

function AdminBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchPosts();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.user_metadata?.role === 'admin') {
        setIsAdmin(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: !post.published,
          published_at: !post.published ? new Date().toISOString() : null
        })
        .eq('id', post.id);

      if (error) throw error;
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <BackButton to="/blog" label="Back to Blog" />
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="px-4 py-2 bg-gradient-cta text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          Manage Blog Posts
        </span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-background-secondary rounded-lg border border-accent-purple/20 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-text-secondary text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                  </div>
                  <p className="text-text-secondary mb-4">{post.excerpt || 'No excerpt'}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-background rounded-full text-xs font-medium text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`p-2 rounded-lg transition-all ${
                      post.published
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                    }`}
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBlog;
