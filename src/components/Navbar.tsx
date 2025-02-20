import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, PenTool, Settings, FolderOpen, Loader2, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Don't show protected navigation items until we have both user and profile
  const showProtectedNav = user && profile;

  return (
    <nav className="bg-background-secondary border-b border-accent-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-accent-purple" />
              <span className="ml-2 text-xl font-bold text-text-primary">Messynotes.ai</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/about" className="text-text-secondary hover:text-accent-purple transition-colors">About</Link>
              <Link to="/blog" className="text-text-secondary hover:text-accent-purple transition-colors flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Blog
              </Link>
              <Link to="/pricing" className="text-text-secondary hover:text-accent-purple transition-colors">Pricing</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showProtectedNav ? (
              <>
                <Link
                  to="/new-project"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/new-project'
                      ? 'text-accent-purple'
                      : 'text-text-secondary hover:text-accent-purple'
                  }`}
                >
                  <PenTool className="h-5 w-5 mr-1" />
                  New Project
                </Link>
                <Link
                  to="/my-projects"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/my-projects'
                      ? 'text-accent-purple'
                      : 'text-text-secondary hover:text-accent-purple'
                  }`}
                >
                  <FolderOpen className="h-5 w-5 mr-1" />
                  My Projects
                </Link>
                <Link
                  to="/settings"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/settings'
                      ? 'text-accent-purple'
                      : 'text-text-secondary hover:text-accent-purple'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-1" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSigningOut ? (
                    <Loader2 className="h-5 w-5 mr-1 animate-spin" />
                  ) : (
                    'Sign Out'
                  )}
                </button>
              </>
            ) : user ? (
              // Show loading state if we have user but no profile yet
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-accent-purple" />
              </div>
            ) : location.pathname !== '/auth' && (
              <Link
                to="/auth"
                className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple to-accent-orange text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;