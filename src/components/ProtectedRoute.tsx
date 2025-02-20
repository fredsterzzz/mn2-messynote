import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireOnboarding = true
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <Loader />;
  }

  // If auth is required and user is not authenticated, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated but profile is not loaded yet, show loading
  if (user && !profile) {
    return <Loader />;
  }

  // If onboarding is required and user hasn't completed it, redirect to onboarding
  if (requireOnboarding && profile && !profile.has_completed_onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}
