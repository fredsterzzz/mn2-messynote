import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireOnboarding = false,
}: Props) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading state only when we're loading AND we don't have user data yet
  if (loading && !user) {
    return <Loader />;
  }

  // If we require authentication and there's no user, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If we require onboarding and the user hasn't completed it, redirect to onboarding
  if (requireOnboarding && profile?.has_completed_onboarding === false) {
    return <Navigate to="/onboarding" replace />;
  }

  // If we have a user but no profile, show loading state
  if (user && !profile) {
    return <Loader />;
  }

  return <>{children}</>;
}
