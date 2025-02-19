import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft, Tag, Clock, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [nextPost, setNextPost] = useState<{ slug: string; title: string } | null>(null);
  const [prevPost, setPrevPost] = useState<{ slug: string; title: string } | null>(null);
  const [readingTime, setReadingTime] = useState<number>(0);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      // Get current post
      const { data: currentPost, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(currentPost);

      if (currentPost) {
        // Calculate reading time
        const words = currentPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        setReadingTime(Math.ceil(words / 200)); // Assuming 200 words per minute

        // Get next and previous posts
        const { data: adjacentPosts } = await supabase
          .from('blog_posts')
          .select('slug, title')
          .eq('published', true)
          .or(`published_at.gt.${currentPost.published_at},published_at.lt.${currentPost.published_at}`)
          .order('published_at', { ascending: true })
          .limit(2);

        if (adjacentPosts) {
          const currentIndex = adjacentPosts.findIndex(p => p.slug === slug);
          setPrevPost(adjacentPosts[currentIndex - 1] || null);
          setNextPost(adjacentPosts[currentIndex + 1] || null);
        }
      }

      // Update meta tags
      if (currentPost) {
        document.title = `${currentPost.title} | MessyNote Blog`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', currentPost.meta_description || '');
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.meta_description,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      {post.featured_image && (
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-32 relative">
        <BackButton to="/blog" label="Back to Blog" />

        <article className="mt-8">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(post.published_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {readingTime} min read
              </div>
              <button
                onClick={handleShare}
                className="flex items-center hover:text-accent-purple transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>

            <h1 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>

            <div className="flex flex-wrap gap-2">
              {post.tags?.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="group px-3 py-1 bg-background-secondary rounded-full text-sm font-medium text-text-secondary border border-accent-purple/20 hover:border-accent-purple transition-colors"
                >
                  <Tag className="h-4 w-4 inline mr-1 group-hover:text-accent-purple transition-colors" />
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          <div 
            className="prose prose-invert max-w-none prose-headings:text-text-primary prose-a:text-accent-purple prose-a:no-underline hover:prose-a:underline prose-pre:bg-background prose-pre:text-text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Post Navigation */}
        <nav className="mt-12 border-t border-accent-purple/20 pt-8">
          <div className="flex justify-between items-center">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="group flex items-start text-left max-w-[40%]"
              >
                <ChevronLeft className="h-5 w-5 mr-2 mt-1 group-hover:text-accent-purple transition-colors flex-shrink-0" />
                <div>
                  <div className="text-sm text-text-secondary mb-1">Previous Post</div>
                  <div className="font-medium group-hover:text-accent-purple transition-colors line-clamp-2">
                    {prevPost.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="group flex items-start text-right max-w-[40%]"
              >
                <div>
                  <div className="text-sm text-text-secondary mb-1">Next Post</div>
                  <div className="font-medium group-hover:text-accent-purple transition-colors line-clamp-2">
                    {nextPost.title}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 ml-2 mt-1 group-hover:text-accent-purple transition-colors flex-shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default BlogPost;
