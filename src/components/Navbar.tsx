import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, PenTool, Settings, FolderOpen, Loader2, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-background-secondary border-b border-accent-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-accent-purple" />
              <span className="ml-2 text-xl font-bold text-text-primary">www.messynotes.ai</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/about" className="text-text-secondary hover:text-accent-purple transition-colors">About</Link>
              <Link to="/blog" className="text-text-secondary hover:text-accent-purple transition-colors flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Blog
              </Link>
              <Link to="/pricing" className="text-text-secondary hover:text-accent-purple transition-colors">Pricing</Link>
              <Link to="/privacy" className="text-text-secondary hover:text-accent-purple transition-colors">Privacy</Link>
              <Link to="/contact" className="text-text-secondary hover:text-accent-purple transition-colors">Contact</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/new-project"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-accent-purple transition-colors"
                >
                  <PenTool className="h-5 w-5 mr-1" />
                  New Project
                </Link>
                <Link
                  to="/my-projects"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-accent-purple transition-colors"
                >
                  <FolderOpen className="h-5 w-5 mr-1" />
                  My Projects
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-accent-purple transition-colors"
                >
                  <Settings className="h-5 w-5 mr-1" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                >
                  {isSigningOut ? (
                    <Loader2 className="h-5 w-5 mr-1 animate-spin" />
                  ) : (
                    'Sign Out'
                  )}
                </button>
              </>
            ) : (
              location.pathname !== '/auth' && (
                <Link
                  to="/auth"
                  className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple to-accent-orange text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;