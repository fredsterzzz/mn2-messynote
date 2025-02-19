import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Google Ads conversion tracking
const GOOGLE_ADS_CONVERSION_ID = 'AW-16869248021';
const GOOGLE_ADS_CONVERSION_LABEL = 'YOUR_CONVERSION_LABEL'; // You'll need to replace this with the actual label from Google Ads

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const trackConversion = () => {
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
        });
      }
    };

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Track the conversion when user successfully signs in
        trackConversion();
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
  }, [navigate]);

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