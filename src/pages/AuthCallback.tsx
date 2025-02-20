import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('AuthCallback - Session check:', { session: !!session, error: sessionError });

        if (sessionError || !session) {
          console.log('AuthCallback - No session found, redirecting to auth');
          navigate('/auth');
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('AuthCallback - Profile check:', { profile, error: profileError });

        if (profileError) {
          console.log('AuthCallback - Creating new profile...');
          // Create profile if it doesn't exist
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                has_completed_onboarding: false,
                credits: 5,
                subscription_tier: 'free',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);

          if (createError) {
            console.error('AuthCallback - Error creating profile:', createError);
            navigate('/auth');
            return;
          }

          console.log('AuthCallback - Profile created, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        // If profile exists, check onboarding status
        if (!profile.has_completed_onboarding) {
          console.log('AuthCallback - Profile exists but onboarding not completed');
          navigate('/onboarding');
        } else {
          console.log('AuthCallback - Profile exists and onboarding completed');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('AuthCallback - Unexpected error:', error);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple mx-auto mb-4" />
        <p className="text-text-secondary">Setting up your account...</p>
      </div>
    </div>
  );
}