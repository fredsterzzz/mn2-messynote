import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if this is a subscription completion
    const isSubscriptionComplete = searchParams.get('subscription') === 'completed';
    
    if (isSubscriptionComplete) {
      // Google Ads Conversion Tracking
      const script = document.createElement('script');
      script.innerHTML = `
        gtag('event', 'conversion', {
          'send_to': 'AW-16462248021',
          'value': 9.99,
          'currency': 'GBP'
        });
      `;
      document.head.appendChild(script);
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-accent-purple animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Completing sign in...</h2>
        <p className="text-text-secondary">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}