import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-accent-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-accent-purple" />
              <span className="ml-2 text-xl font-bold text-text-primary">MessyNotes.ai</span>
            </Link>
            <p className="text-text-secondary">
              Your AI-powered note transformation assistant. Turn messy thoughts into polished content instantly.
            </p>
            <p className="text-text-secondary text-sm">
              MessyNotes.ai Ltd
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-text-secondary hover:text-accent-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-text-secondary hover:text-accent-purple transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-accent-purple transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-text-secondary hover:text-accent-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-text-secondary hover:text-accent-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-text-secondary hover:text-accent-purple transition-colors">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-text-secondary hover:text-accent-purple transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-text-secondary">
                <Mail className="h-5 w-5 mr-2 text-accent-purple" />
                contact@messynotes.ai
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-accent-purple/20">
          <p className="text-center text-text-secondary">
            &copy; {new Date().getFullYear()} MessyNotes.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;