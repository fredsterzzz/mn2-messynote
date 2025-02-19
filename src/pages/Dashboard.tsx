import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, BarChart, Sparkles, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import type { Project } from '../types/user';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleNewProject = () => {
    if (credits === 0) {
      navigate('/pricing');
    } else {
      navigate('/new-project');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">{user?.email?.split('@')[0] || 'User'}</span>!
        </h1>
        <p className="text-text-secondary">
          {credits?.subscription_status === 'active' ? (
            'You have unlimited transformations with your Premium plan.'
          ) : (
            `You have ${credits?.credits_remaining || 0} transformations remaining.`
          )}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={handleNewProject}
          className="bg-background-secondary p-8 rounded-xl border border-accent-purple/20 hover:border-accent-purple/40 transition-all hover:scale-105"
        >
          <FileText className="h-8 w-8 text-accent-purple mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-text-primary">New Project</h3>
          <p className="text-text-secondary">Start transforming your notes</p>
        </button>

        <Link
          to="/my-projects"
          className="bg-background-secondary p-8 rounded-xl border border-accent-purple/20 hover:border-accent-purple/40 transition-all hover:scale-105"
        >
          <Clock className="h-8 w-8 text-accent-orange mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-text-primary">Recent Projects</h3>
          <p className="text-text-secondary">View your latest transformations</p>
        </Link>

        <Link
          to="/settings"
          className="bg-background-secondary p-8 rounded-xl border border-accent-purple/20 hover:border-accent-purple/40 transition-all hover:scale-105"
        >
          <BarChart className="h-8 w-8 text-accent-blue mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-text-primary">Analytics</h3>
          <p className="text-text-secondary">Track your usage and insights</p>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-accent-purple mr-2" />
            <h2 className="text-xl font-semibold text-text-primary">Recent Projects</h2>
          </div>
          <Link
            to="/my-projects"
            className="text-accent-purple hover:text-accent-purple/80 transition-colors text-sm"
          >
            View all projects
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-accent-purple animate-spin" />
            </div>
          ) : projects.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-accent-purple/20">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-accent-purple/10">
                    <td className="py-3 px-4 text-text-primary">{project.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{project.type}</td>
                    <td className="py-3 px-4 text-text-secondary">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewProject(project.id)}
                        className="text-accent-purple hover:text-accent-purple/80 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">No projects yet.</p>
              <button
                onClick={handleNewProject}
                className="text-accent-purple hover:text-accent-purple/80 transition-colors mt-2 inline-block"
              >
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;