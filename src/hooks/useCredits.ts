import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { UserCredits } from '../types/user';

export function useCredits() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchCredits() {
      try {
        const { data, error } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setCredits(data);
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, [user]);

  const checkCredits = async (): Promise<boolean> => {
    if (!credits) return false;

    if (credits.subscription_status === 'active' || credits.subscription_status === 'trialing') {
      return true;
    }

    if (credits.credits_remaining <= 0) {
      navigate('/pricing?reason=no-credits');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ 
          credits_remaining: credits.credits_remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setCredits(data);
      return true;
    } catch (error) {
      console.error('Error updating credits:', error);
      return false;
    }
  };

  const resetCredits = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ 
          credits_remaining: 3,
          subscription_status: 'none',
          subscription_end_date: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setCredits(data);
      return true;
    } catch (error) {
      console.error('Error resetting credits:', error);
      return false;
    }
  };

  return { credits, loading, checkCredits, resetCredits };
}