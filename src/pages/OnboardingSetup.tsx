import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const roles = [
  { id: 'student', label: 'Student' },
  { id: 'researcher', label: 'Researcher' },
  { id: 'professional', label: 'Professional' },
  { id: 'other', label: 'Other' }
];

export default function OnboardingSetup() {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Refresh the profile to get the updated data
      await refreshProfile();
      
      // Navigate to new project page
      navigate('/new-project');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-background-secondary rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Welcome!</h2>
          <p className="mt-2 text-text-secondary">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-text-primary font-medium">What best describes your role?</label>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                      : 'border-border hover:border-accent-purple/50 text-text-secondary'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !selectedRole}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isSubmitting || !selectedRole
                ? 'bg-accent-purple/50 cursor-not-allowed'
                : 'bg-accent-purple hover:bg-accent-purple/90'
            }`}
          >
            {isSubmitting ? 'Setting up...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
