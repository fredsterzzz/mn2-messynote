import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Shield, CreditCard } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'notifications' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'security' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'billing' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
        >
          Billing
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'blog' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
          >
            Blog Management
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'notifications' && (
          <div>
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium">Email Notifications</label>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-orange-500" />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">Marketing Emails</label>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 mr-2 text-orange-500" />
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium">Two-Factor Authentication</label>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-orange-500" />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">Auto Logout</label>
                <input type="checkbox" className="form-checkbox h-5 w-5 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
              <h2 className="text-xl font-semibold">Billing Settings</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleBillingPortal}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'blog' && isAdmin && (
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold">Blog Management</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/admin/blog/new')}
                className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create New Blog Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}