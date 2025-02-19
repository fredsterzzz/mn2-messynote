import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react';

// Sample blog post data - replace with real data from your backend
const blogPost = {
  id: 1,
  title: 'How AI is Revolutionizing Note-Taking',
  content: `
    <p>Artificial Intelligence has become an integral part of our daily lives, and one area where it's making a significant impact is note-taking. The traditional method of taking notes, whether digital or analog, often results in disorganized, hard-to-navigate documents that fail to capture the full context of our thoughts.</p>

    <h2>The Evolution of Note-Taking</h2>
    <p>Throughout history, note-taking has evolved from simple paper and pen to digital tools. However, the fundamental challenges remained: organization, searchability, and the ability to transform rough notes into polished content.</p>

    <h2>Enter AI-Powered Note-Taking</h2>
    <p>AI is revolutionizing this space by introducing features like:</p>
    <ul>
      <li>Automatic categorization and tagging</li>
      <li>Smart summarization</li>
      <li>Context-aware suggestions</li>
      <li>Real-time formatting and organization</li>
    </ul>

    <h2>The Future of Note-Taking</h2>
    <p>As AI technology continues to advance, we can expect even more sophisticated features that will make note-taking more efficient and productive than ever before.</p>
  `,
  date: 'Feb 19, 2025',
  readTime: '5 min read',
  category: 'AI Technology',
  author: {
    name: 'Alex Thompson',
    role: 'AI Product Specialist',
    avatar: '/blog/author-avatar.jpg'
  }
};

export default function BlogPost() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-radial from-accent-purple/20 via-background to-background" />
        <div className="relative max-w-3xl mx-auto">
          <Link 
            to="/blog"
            className="inline-flex items-center text-text-secondary hover:text-accent-purple mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-text-secondary flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {blogPost.date}
            </span>
            <span className="text-sm text-text-secondary flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {blogPost.readTime}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {blogPost.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            {blogPost.title}
          </h1>

          <div className="flex items-center gap-4 mb-12 p-4 bg-background-secondary rounded-lg border border-accent-purple/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-purple to-accent-orange flex items-center justify-center text-white font-bold">
              {blogPost.author.name[0]}
            </div>
            <div>
              <div className="font-semibold">{blogPost.author.name}</div>
              <div className="text-sm text-text-secondary">{blogPost.author.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg prose-purple max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-accent-purple/20">
          <h3 className="text-xl font-semibold mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-background-secondary rounded-lg border border-accent-purple/20 hover:border-accent-purple/40 transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 bg-background-secondary rounded-lg border border-accent-purple/20 hover:border-accent-purple/40 transition-colors">
              LinkedIn
            </button>
            <button className="px-4 py-2 bg-background-secondary rounded-lg border border-accent-purple/20 hover:border-accent-purple/40 transition-colors">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}