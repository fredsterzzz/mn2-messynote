import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet';

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

    // Check current session immediately
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        trackConversion();
        navigate('/dashboard');
        return true;
      }
      return false;
    };

    // Try to get current session first
    checkSession().then(hasSession => {
      // Only set up listener if we don't have a session yet
      if (!hasSession) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            trackConversion();
            navigate('/dashboard');
          } else if (event === 'SIGNED_OUT') {
            navigate('/auth');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    });
  }, [navigate]);

  return (
    <>
      <Helmet>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16869248021"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16869248021');
          `}
        </script>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-purple mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Completing Sign In</h2>
          <p className="text-text-secondary">Please wait while we redirect you...</p>
        </div>
      </div>
    </>
  );
}