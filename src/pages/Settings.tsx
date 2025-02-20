import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Shield, CreditCard, BookOpen, Plus } from 'lucide-react';
import { createPortalSession } from '../services/stripe';

export default function Settings() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleBillingPortal = async () => {
    setIsLoading(true);
    try {
      await createPortalSession(user?.id);
    } catch (error) {
      console.error('Error accessing billing portal:', error);
    }
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          Settings
        </span>
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center justify-center px-4 py-3 rounded-lg ${
            activeTab === 'notifications'
              ? 'bg-gradient-to-r from-accent-purple to-accent-orange text-white'
              : 'bg-background-secondary border border-accent-purple/20 text-text-primary hover:border-accent-purple/40'
          }`}
        >
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center justify-center px-4 py-3 rounded-lg ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-accent-purple to-accent-orange text-white'
              : 'bg-background-secondary border border-accent-purple/20 text-text-primary hover:border-accent-purple/40'
          }`}
        >
          <Shield className="h-5 w-5 mr-2" />
          Security
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center justify-center px-4 py-3 rounded-lg ${
            activeTab === 'billing'
              ? 'bg-gradient-to-r from-accent-purple to-accent-orange text-white'
              : 'bg-background-secondary border border-accent-purple/20 text-text-primary hover:border-accent-purple/40'
          }`}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Billing
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center justify-center px-4 py-3 rounded-lg ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-accent-purple to-accent-orange text-white'
                : 'bg-background-secondary border border-accent-purple/20 text-text-primary hover:border-accent-purple/40'
            }`}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Blog
          </button>
        )}
      </div>

      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
        {activeTab === 'notifications' && (
          <div>
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-accent-purple mr-2" />
              <h2 className="text-xl font-semibold">Notification Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-text-secondary">Receive updates about your projects</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-text-secondary">Receive marketing and promotional emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-accent-purple mr-2" />
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-text-secondary">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto Logout</h3>
                  <p className="text-sm text-text-secondary">Automatically log out when inactive</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-accent-purple mr-2" />
              <h2 className="text-xl font-semibold">Billing Settings</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleBillingPortal}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'blog' && isAdmin && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-accent-purple mr-2" />
                <h2 className="text-xl font-semibold">Blog Management</h2>
              </div>
              <button
                onClick={() => navigate('/admin/blog/new')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-orange text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}