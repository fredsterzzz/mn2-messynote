import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, FileText, Wand2, Brain, PenTool, BookOpen, FileSearch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Project } from '../types/user';

function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!user || !projectId) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId, user, navigate]);

  const handleDownload = () => {
    if (!project) return;

    const element = document.createElement('a');
    const file = new Blob([project.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${project.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'freeform':
        return <PenTool className="h-5 w-5" />;
      case 'task':
        return <Brain className="h-5 w-5" />;
      case 'blog':
        return <BookOpen className="h-5 w-5" />;
      case 'research':
        return <FileSearch className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-purple animate-spin" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getProjectTypeIcon(project.type)}
              <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{project.type} Note</span>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-accent-purple/10 text-accent-purple rounded-lg hover:bg-accent-purple/20 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Download
          </button>
        </div>

        {(project.template || project.tone) && (
          <div className="mb-6 flex gap-4 text-sm">
            {project.template && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-accent-purple/10">
                <Wand2 className="h-4 w-4 text-accent-purple" />
                <span>Template: <span className="text-text-primary capitalize">{project.template}</span></span>
              </div>
            )}
            {project.tone && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-accent-purple/10">
                <FileText className="h-4 w-4 text-accent-purple" />
                <span>Tone: <span className="text-text-primary capitalize">{project.tone}</span></span>
              </div>
            )}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <div className="bg-background rounded-lg p-6 border border-accent-purple/10 whitespace-pre-wrap">
            {project.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView;