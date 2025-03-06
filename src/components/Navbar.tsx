import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-accent-purple/10">
      <div className="cosmic-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              <span className="text-gradient">Messy</span>
              Notes.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/new-project" className="text-text-secondary hover:text-text-primary transition-colors">
              New Project
            </Link>
            <Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/blog" className="text-text-secondary hover:text-text-primary transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-text-secondary hover:text-text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth" className="epic-button-secondary">
              Log In
            </Link>
            <Link to="/auth?signup=true" className="epic-button-primary">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-background/95 backdrop-blur-lg border-b border-accent-purple/10 animate-slide-down">
          <div className="cosmic-container py-4 space-y-4">
            <Link
              to="/new-project"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              New Project
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/auth"
                className="epic-button-secondary w-full justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/auth?signup=true"
                className="epic-button-primary w-full justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}