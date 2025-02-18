import React, { useEffect, useState } from 'react';
import { FileText, Trash2, Edit, Download, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Project } from '../types/user';
import BackButton from '../components/BackButton';

function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditedContent(project.content);
  };

  const handleSave = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ content: editedContent, updated_at: new Date().toISOString() })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, content: editedContent } : p
      ));
      setEditingProject(null);
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error updating project:', err);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
    }
  };

  const handleDownload = (project: Project) => {
    const element = document.createElement('a');
    const file = new Blob([project.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${project.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton to="/dashboard" label="Back to Dashboard" />
      
      <div className="flex items-center mb-8">
        <FileText className="h-8 w-8 text-accent-purple mr-3" />
        <h1 className="text-2xl font-bold text-text-primary">My Projects</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-background-secondary rounded-xl border border-accent-purple/20">
            <p className="text-text-secondary">No projects yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-background-secondary rounded-xl border border-accent-purple/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {project.type} • {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {editingProject === project.id ? (
                    <button
                      onClick={() => handleSave(project.id)}
                      className="p-2 text-accent-purple hover:text-accent-purple/80 rounded-lg hover:bg-background transition-colors"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-text-secondary hover:text-accent-purple rounded-lg hover:bg-background transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(project)}
                    className="p-2 text-text-secondary hover:text-accent-purple rounded-lg hover:bg-background transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-text-secondary hover:text-red-500 rounded-lg hover:bg-background transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {editingProject === project.id ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-48 rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20 p-4"
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-background rounded-lg p-4 border border-accent-purple/10">
                    {project.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyProjects;