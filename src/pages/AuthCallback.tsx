import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
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