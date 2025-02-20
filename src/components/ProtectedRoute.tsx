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
  const { user, loading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      console.log('ProtectedRoute - Starting checks...', {
        user: user?.id,
        requireOnboarding,
        loading
      });

      if (!user) {
        console.log('ProtectedRoute - No user, skipping onboarding check');
        setCheckingOnboarding(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('ProtectedRoute - Profile check:', { profile, error });

        if (error) {
          console.log('ProtectedRoute - No profile found, creating one...');
          // Create a profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                has_completed_onboarding: false,
                credits: 5,
                subscription_tier: 'free',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);

          if (insertError) {
            console.error('ProtectedRoute - Error creating profile:', insertError);
          }
          setHasCompletedOnboarding(false);
        } else {
          console.log('ProtectedRoute - Profile found:', {
            hasCompletedOnboarding: profile?.has_completed_onboarding,
            credits: profile?.credits,
            tier: profile?.subscription_tier
          });
          setHasCompletedOnboarding(profile?.has_completed_onboarding ?? false);
        }
      } catch (error) {
        console.error('ProtectedRoute - Error checking profile:', error);
        setHasCompletedOnboarding(false);
      }

      setCheckingOnboarding(false);
    };

    checkOnboardingStatus();
  }, [user, requireOnboarding]);

  if (loading || checkingOnboarding) {
    console.log('ProtectedRoute - Loading state:', { authLoading: loading, checkingOnboarding });
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
    console.log('ProtectedRoute - No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (requireOnboarding && !hasCompletedOnboarding) {
    console.log('ProtectedRoute - Redirecting to onboarding:', {
      requireOnboarding,
      hasCompletedOnboarding
    });
    return <Navigate to="/onboarding" replace />;
  }

  console.log('ProtectedRoute - All checks passed, rendering protected content');
  return <>{children}</>;
}
