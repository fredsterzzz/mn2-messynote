import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Save, X } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published: boolean;
  tags: string[];
  meta_description: string;
}

function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    published: false,
    tags: [],
    meta_description: ''
  });

  useEffect(() => {
    checkAdmin();
    if (id) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

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

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setPost(prev => ({ ...prev, tags }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(post)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([post]);
        if (error) throw error;
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <BackButton to="/admin/blog" label="Back to Posts" />
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/blog')}
            className="px-4 py-2 bg-background-secondary text-text-primary border border-accent-purple/20 rounded-lg font-semibold hover:bg-background transition-all flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-gradient-cta text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </>
            )}
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          {id ? 'Edit Post' : 'New Post'}
        </span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleTitleChange}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            name="slug"
            value={post.slug}
            onChange={handleChange}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            name="featured_image"
            value={post.featured_image}
            onChange={handleChange}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Content (HTML)
          </label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            rows={15}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20 font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={post.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
            placeholder="AI, Writing Tips, Updates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Meta Description (for SEO)
          </label>
          <textarea
            name="meta_description"
            value={post.meta_description}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={post.published}
            onChange={(e) => setPost(prev => ({ ...prev, published: e.target.checked }))}
            className="h-4 w-4 text-accent-purple border-accent-purple/20 focus:ring-accent-purple"
          />
          <label htmlFor="published" className="ml-2 text-sm text-text-secondary">
            Publish this post
          </label>
        </div>
      </form>
    </div>
  );
}

export default AdminBlogEdit;
