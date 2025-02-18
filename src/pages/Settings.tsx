import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Loader2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { createPortalSession } from '../services/stripe';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

function Settings() {
  const { user } = useAuth();
  const { credits, loading, resetCredits } = useCredits();
  const [isLoadingPortal, setIsLoadingPortal] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Check if user can change password (only email+password users can)
  const canChangePassword = user?.app_metadata?.provider === 'email';

  const handleBillingPortal = async () => {
    if (!user) return;
    
    setIsLoadingPortal(true);
    try {
      const { url } = await createPortalSession(user.id);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleResetCredits = async () => {
    setIsResetting(true);
    try {
      await resetCredits();
    } catch (error) {
      console.error('Reset error:', error);
      alert('Failed to reset credits. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChangingPassword(true);

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwords.current
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (updateError) throw updateError;

      setPasswordSuccess('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton to="/dashboard" label="Back to Dashboard" />

      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          Settings
        </span>
      </h1>

      {/* Profile Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold text-text-primary">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
              value={user?.email || ''}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold text-text-primary">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text-primary">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-purple/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-primary after:border-accent-purple/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold text-text-primary">Security</h2>
        </div>
        <div className="space-y-4">
          {!canChangePassword ? (
            <div className="text-text-secondary">
              Password management is handled by your sign-in provider ({user?.app_metadata?.provider}).
            </div>
          ) : !isChangingPassword ? (
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="text-accent-purple hover:text-accent-purple/80 transition-colors font-medium"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswords({ current: '', new: '', confirm: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="px-4 py-2 bg-background text-text-primary border border-accent-purple/20 rounded-lg font-semibold hover:bg-background-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="px-4 py-2 bg-accent-purple text-white rounded-lg font-semibold hover:bg-accent-purple/90 transition-all disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
              {passwordError && (
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="h-4 w-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Billing Settings */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-accent-purple mr-2" />
          <h2 className="text-xl font-semibold text-text-primary">Billing</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 text-accent-purple animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-6 bg-background rounded-lg border border-accent-purple/10">
              <div>
                <p className="font-medium text-text-primary">
                  {credits?.subscription_status === 'active' ? (
                    'Current Plan: Premium'
                  ) : (
                    'Current Plan: Free'
                  )}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {credits?.subscription_status === 'active' ? (
                    'Unlimited transformations'
                  ) : (
                    `${credits?.credits_remaining || 0} transformations remaining`
                  )}
                </p>
                {credits?.subscription_end_date && (
                  <p className="text-sm text-text-secondary mt-1">
                    Next billing date: {new Date(credits.subscription_end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleResetCredits}
                  disabled={isResetting}
                  className="px-4 py-2 bg-background-secondary text-text-primary border border-accent-purple/20 rounded-lg font-semibold hover:bg-background transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isResetting ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Resetting...
                    </span>
                  ) : (
                    'Reset Credits'
                  )}
                </button>
                <button
                  onClick={handleBillingPortal}
                  disabled={isLoadingPortal}
                  className="px-4 py-2 bg-gradient-cta text-white rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoadingPortal ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    'Manage Subscription'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;