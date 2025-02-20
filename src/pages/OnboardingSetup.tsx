import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2, Search, Briefcase, GraduationCap, Gift } from 'lucide-react';

export default function OnboardingSetup() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [studentLevel, setStudentLevel] = useState('');

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role, has_completed_onboarding')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking profile:', error);
        return;
      }

      if (data?.has_completed_onboarding) {
        navigate('/dashboard');
      }
    };

    checkProfile();
  }, [user, navigate]);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!user?.id) {
        throw new Error('No user found. Please sign in again.');
      }

      const role = isStudent 
        ? `Student - ${studentLevel}` 
        : selectedRole;

      if (!role) {
        throw new Error('Please select a role to continue.');
      }

      console.log('Updating profile:', { userId: user.id, role });

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: role,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Profile updated successfully, redirecting to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Welcome to MessyNotes
            </span>
          </h2>
          <p className="text-lg text-text-secondary">Let's personalize your experience</p>
        </div>

        {/* Credits Display */}
        <div className="bg-background-secondary p-6 rounded-xl border border-accent-purple/20 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="h-6 w-6 text-accent-purple" />
              <div>
                <h3 className="font-medium text-text-primary">Free Credits</h3>
                <p className="text-sm text-text-secondary">Get started with MessyNotes</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-accent-purple">{profile?.credits || 5}</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6 bg-background-secondary p-8 rounded-xl border border-accent-purple/20 shadow-lg backdrop-blur-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent-purple mb-4" />
              <p className="text-text-secondary">Saving your preferences...</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-6 text-center text-text-primary">What best describes you?</h3>
                  <button
                    onClick={() => {
                      setIsStudent(false);
                      setStep(2);
                    }}
                    className="w-full p-6 text-left rounded-lg border border-accent-purple/20 hover:border-accent-purple transition-all hover:bg-accent-purple/5 group"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-accent-purple/10 group-hover:bg-accent-purple/20 transition-colors">
                        <Briefcase className="h-6 w-6 text-accent-purple" />
                      </div>
                      <div className="ml-4">
                        <span className="text-lg font-medium text-text-primary">I'm a Professional</span>
                        <p className="text-text-secondary text-sm mt-1">Working in industry or self-employed</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setIsStudent(true);
                      setStep(3);
                    }}
                    className="w-full p-6 text-left rounded-lg border border-accent-purple/20 hover:border-accent-purple transition-all hover:bg-accent-purple/5 group"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-accent-purple/10 group-hover:bg-accent-purple/20 transition-colors">
                        <GraduationCap className="h-6 w-6 text-accent-purple" />
                      </div>
                      <div className="ml-4">
                        <span className="text-lg font-medium text-text-primary">I'm a Student</span>
                        <p className="text-text-secondary text-sm mt-1">Currently in education or training</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-2 text-text-primary">What's your profession?</h3>
                    <p className="text-text-secondary">This helps us personalize your experience</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      'Software Developer',
                      'Marketing Professional',
                      'Content Creator',
                      'Business Owner',
                      'Other Professional'
                    ].map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          handleSubmit();
                        }}
                        className="w-full p-4 text-left rounded-lg border border-accent-purple/20 hover:border-accent-purple hover:bg-accent-purple/5 transition-all"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-2 text-text-primary">What's your education level?</h3>
                    <p className="text-text-secondary">This helps us tailor content to your needs</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      'High School Student',
                      'Undergraduate Student',
                      'Graduate Student',
                      'PhD Student',
                      'Other Student'
                    ].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setStudentLevel(level);
                          handleSubmit();
                        }}
                        className="w-full p-4 text-left rounded-lg border border-accent-purple/20 hover:border-accent-purple hover:bg-accent-purple/5 transition-all"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
