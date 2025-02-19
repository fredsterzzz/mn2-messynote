import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import BackButton from '../components/BackButton';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string;
  published_at: string;
  tags: string[];
  meta_description: string;
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);

      // Update meta tags
      if (data) {
        document.title = `${data.title} | MessyNote Blog`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.meta_description || '');
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-purple"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Post not found</h1>
        <p className="text-text-secondary mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/blog"
          className="inline-flex items-center text-accent-purple hover:text-accent-purple/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton to="/blog" label="Back to Blog" />

      <article className="mt-8">
        {post.featured_image && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center text-text-secondary mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(post.published_at)}
        </div>

        <h1 className="text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
            {post.title}
          </span>
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags?.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-background-secondary rounded-full text-sm font-medium text-text-secondary"
            >
              <Tag className="h-4 w-4 inline mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

export default BlogPost;
