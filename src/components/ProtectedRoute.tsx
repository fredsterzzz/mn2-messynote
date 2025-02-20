import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({ children, requireOnboarding = true }: Props) {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('has_completed_onboarding')
          .eq('id', user.id)
          .single();

        setHasCompletedOnboarding(data?.has_completed_onboarding ?? false);
      } catch (error) {
        console.error("Profile check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-purple mx-auto mb-4" />
          <p className="text-text-secondary">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireOnboarding && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
