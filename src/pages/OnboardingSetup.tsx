import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const JOB_OPTIONS = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Student',
  'Teacher/Professor',
  'Marketing Specialist',
  'Freelancer',
  'Business Owner',
  'Content Creator',
  'Other Professional'
];

export default function OnboardingSetup() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      // Refresh the profile in AuthContext
      await refreshProfile();
      
      // Navigate to new project page
      navigate('/dashboard/new-project');
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Failed to save selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Welcome to MessyNotes
            </span>
          </h2>
          <p className="text-lg text-text-secondary">Let's personalize your experience</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-center">
              Select Your Primary Role
            </h3>
            
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 rounded-lg border border-accent-purple/20 bg-background focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
            >
              <option value="">Choose your role...</option>
              {JOB_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {selectedRole && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 flex items-center">
                  <span className="font-semibold">Selected: {selectedRole}</span>
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!selectedRole}
              className="w-full bg-accent-purple text-white p-3 rounded-lg disabled:opacity-50 hover:bg-accent-purple-dark transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-center text-blue-900 mb-2">
                Confirm Your Selection
              </h3>
              <p className="text-center text-blue-800">
                You've selected: <br />
                <span className="text-2xl font-bold block mt-2">{selectedRole}</span>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-accent-purple text-white p-3 rounded-lg hover:bg-accent-purple-dark disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Confirm & Continue'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
