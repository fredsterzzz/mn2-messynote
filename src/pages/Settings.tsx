import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Shield, CreditCard, BookOpen, Plus, User, Search, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { createPortalSession } from '../services/stripe';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [jobRole, setJobRole] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobResults, setJobResults] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load user profile
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setJobRole(data.role || '');
        setIsStudent(data.role?.startsWith('Student -') || false);
      }
    };

    loadProfile();
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

  // Simulated job search - replace with actual O*NET API
  const searchJobs = async (term: string) => {
    // TODO: Integrate with O*NET API
    const mockJobs = [
      'Software Developer',
      'Marketing Manager',
      'Sales Representative',
      'Teacher',
      'Nurse',
      'Accountant',
    ].filter(job => job.toLowerCase().includes(term.toLowerCase()));
    
    setJobResults(mockJobs);
  };

  const handleJobSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      searchJobs(term);
    } else {
      setJobResults([]);
    }
  };

  const updateJobRole = async (newRole: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      setJobRole(newRole);
      setSearchTerm('');
      setJobResults([]);
    } catch (error) {
      console.error('Error updating job role:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
          Settings
        </span>
      </h1>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center justify-center px-4 py-3 rounded-lg ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-accent-purple to-accent-orange text-white'
              : 'bg-background-secondary border border-accent-purple/20 text-text-primary hover:border-accent-purple/40'
          }`}
        >
          <User className="h-5 w-5 mr-2" />
          Profile
        </button>
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
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Role</h3>
              <p className="text-text-secondary mb-4">
                Current role: {jobRole || 'Not set'}
              </p>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setIsStudent(false)}
                  className={`flex-1 p-4 rounded-lg border ${
                    !isStudent
                      ? 'border-accent-purple bg-accent-purple/10'
                      : 'border-accent-purple/20'
                  }`}
                >
                  <Briefcase className="h-5 w-5 mb-2" />
                  <span>Professional</span>
                </button>
                <button
                  onClick={() => setIsStudent(true)}
                  className={`flex-1 p-4 rounded-lg border ${
                    isStudent
                      ? 'border-accent-purple bg-accent-purple/10'
                      : 'border-accent-purple/20'
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mb-2" />
                  <span>Student</span>
                </button>
              </div>

              {!isStudent ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search for your job title..."
                      value={searchTerm}
                      onChange={(e) => handleJobSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-accent-purple/20 bg-background focus:outline-none focus:border-accent-purple/40"
                    />
                  </div>

                  {jobResults.length > 0 && (
                    <div className="mt-2 border border-accent-purple/20 rounded-lg overflow-hidden">
                      {jobResults.map((job) => (
                        <button
                          key={job}
                          onClick={() => updateJobRole(job)}
                          className="w-full p-3 text-left hover:bg-accent-purple/10 transition-colors border-b border-accent-purple/10 last:border-0"
                        >
                          {job}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-text-secondary mb-2">Don't see your job?</p>
                    <input
                      type="text"
                      placeholder="Enter your job title"
                      className="w-full px-4 py-2 rounded-lg border border-accent-purple/20 bg-background focus:outline-none focus:border-accent-purple/40 mb-4"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateJobRole(e.currentTarget.value);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {['High School', 'Undergraduate', 'Graduate', 'PhD', 'Other'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateJobRole(`Student - ${level}`)}
                      className={`w-full p-4 text-left rounded-lg border ${
                        jobRole === `Student - ${level}`
                          ? 'border-accent-purple bg-accent-purple/10'
                          : 'border-accent-purple/20 hover:border-accent-purple/40'
                      } transition-all`}
                    >
                      {level} Student
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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