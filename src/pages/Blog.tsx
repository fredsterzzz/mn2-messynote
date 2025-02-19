import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

// Sample blog data - you can replace this with real data from your backend
const blogPosts = [
  {
    id: 1,
    title: 'How AI is Revolutionizing Note-Taking',
    excerpt: 'Discover how artificial intelligence is transforming the way we take and organize notes, making the process more efficient and productive than ever before.',
    date: 'Feb 19, 2025',
    readTime: '5 min read',
    category: 'AI Technology',
    image: '/blog/ai-notes.jpg', // You'll need to add these images
  },
  {
    id: 2,
    title: 'Best Practices for Digital Note Organization',
    excerpt: 'Learn the most effective strategies for organizing your digital notes, from folder structures to tagging systems that help you find information quickly.',
    date: 'Feb 15, 2025',
    readTime: '4 min read',
    category: 'Productivity',
    image: '/blog/organization.jpg',
  },
  {
    id: 3,
    title: 'From Chaos to Clarity: The MessyNote Story',
    excerpt: 'The journey of how MessyNote was created to solve the universal problem of messy, disorganized notes and transform them into clear, actionable content.',
    date: 'Feb 10, 2025',
    readTime: '6 min read',
    category: 'Company News',
    image: '/blog/story.jpg',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-purple/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-background-secondary border border-accent-purple/20 mb-8">
              <BookOpen className="h-4 w-4 text-accent-purple mr-2" />
              <span className="text-sm">MessyNote Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Insights on
              <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent"> AI & Productivity</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Explore the latest trends in AI note-taking, productivity tips, and stories from our community.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group bg-background-secondary rounded-xl overflow-hidden border border-accent-purple/10 hover:border-accent-purple/30 transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-background-secondary">
                <div className="w-full h-48 bg-gradient-to-br from-accent-purple/5 to-accent-orange/5 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-accent-purple opacity-50" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-text-secondary flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent-purple transition-colors">
                  {post.title}
                </h3>
                <p className="text-text-secondary mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-accent-purple font-medium">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-background-secondary rounded-2xl p-8 md:p-12 border border-accent-purple/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-text-secondary mb-8">
              Subscribe to our newsletter for the latest insights on AI note-taking and productivity.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-background border border-accent-purple/20 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}