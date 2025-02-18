import React from 'react';
import { User, Bell, Shield, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { createPortalSession } from '../services/stripe';
import BackButton from '../components/BackButton';

function Settings() {
  const { user } = useAuth();
  const { credits, loading, resetCredits } = useCredits();
  const [isLoadingPortal, setIsLoadingPortal] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

  const handleBillingPortal = async () => {
    if (!user) return;
    
    setIsLoadingPortal(true);
    try {
      await createPortalSession(user.id);
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
          <button className="text-accent-purple hover:text-accent-purple/80 transition-colors font-medium">
            Change Password
          </button>
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