import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Wand2, Loader2, AlertCircle, Car, Home, Briefcase, ShoppingBag, FileEdit, PenTool, Presentation, BookOpen, Sparkles } from 'lucide-react';
import { industries, Industry, Template, Tone } from '../data/industries';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { transformNotes, templates, tones } from '../services/openai';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

function NewProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, checkCredits } = useCredits();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleIndustryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const industry = industries.find(i => i.id === event.target.value);
    setSelectedIndustry(industry || null);
    setSelectedTemplate('');
    setSelectedTones([]);
  };

  const handleToneToggle = (toneId: string) => {
    setSelectedTones(prev => {
      if (prev.includes(toneId)) {
        return prev.filter(id => id !== toneId);
      } else {
        return [...prev, toneId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !selectedIndustry || !selectedTemplate || selectedTones.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const hasCredits = await checkCredits();
      if (!hasCredits) {
        navigate('/pricing?reason=no-credits');
        return;
      }

      const result = await transformNotes(
        notes,
        selectedTemplate,
        selectedTones.join(',')
      );

      const { data, error: dbError } = await supabase
        .from('projects')
        .insert([
          {
            name: projectName,
            industry_id: selectedIndustry.id,
            template_id: selectedTemplate,
            tones: selectedTones,
            content: result,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;
      navigate(`/project/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        {showWelcome && (
          <div className="mb-8 p-6 bg-background/80 backdrop-blur-lg rounded-xl border border-accent-purple/30 reveal-animation">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-accent-purple mr-3 sparkle-animation" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-purple-400 bg-clip-text text-transparent">
                  Welcome to MessyNotes.ai
                </h1>
              </div>
              <p className="text-text-secondary">Your Gateway to Polished Brilliance!</p>
            </div>
          </div>
        )}
        
        <div className="bg-background/80 backdrop-blur-lg rounded-xl border border-accent-purple/30 p-8 epic-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center reveal-animation reveal-delay-1">
                <FileText className="h-8 w-8 text-accent-purple mr-3 float-animation" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-purple-400 bg-clip-text text-transparent">
                  Create Your Masterpiece
                </h1>
              </div>
              {credits && (
                <div className="text-text-secondary reveal-animation reveal-delay-2">
                  {credits.subscription_status === 'active' ? (
                    <span className="text-accent-purple pulse-animation">✨ Premium Plan</span>
                  ) : (
                    <span>Credits remaining: {credits.credits_remaining}</span>
                  )}
                </div>
              )}
            </div>

            {/* Project Name */}
            <div className="reveal-animation reveal-delay-3">
              <label className="block text-lg font-semibold text-text-primary mb-4">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name..."
                className="w-full rounded-xl bg-background/50 backdrop-blur-sm border-2 border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20 p-4 transition-all"
                required
              />
            </div>

            {/* Industry Selection */}
            <div className="reveal-animation reveal-delay-4">
              <label className="block text-lg font-semibold text-text-primary mb-4">
                Choose Your Industry
              </label>
              <select
                value={selectedIndustry?.id || ''}
                onChange={handleIndustryChange}
                className="w-full rounded-xl bg-background/50 backdrop-blur-sm border-2 border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20 p-4 transition-all"
                required
              >
                <option value="">Select an industry</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Selection */}
            {selectedIndustry && (
              <div className="mb-8 reveal-animation">
                <h2 className="text-lg font-semibold mb-4 text-text-primary">Choose Your Template</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedIndustry.templates.map((template) => (
                    <button
                      type="button"
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`epic-card p-6 rounded-xl border-2 text-center transition-all ${
                        selectedTemplate === template.id
                          ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                          : 'border-accent-purple/20 hover:border-accent-purple/40'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 mb-3 float-animation">
                          {template.icon}
                        </div>
                        <span className="font-semibold">{template.name}</span>
                        <span className="text-sm text-text-secondary mt-1">{template.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tone Selection */}
            {selectedTemplate && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-text-primary">Set the Tone</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedIndustry?.tones.map((tone) => (
                    <button
                      type="button"
                      key={tone.id}
                      onClick={() => handleToneToggle(tone.id)}
                      className={`epic-card p-6 rounded-xl border-2 text-center transition-all ${
                        selectedTones.includes(tone.id)
                          ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                          : 'border-accent-purple/20 hover:border-accent-purple/40'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-3 float-animation">{tone.icon}</span>
                        <span className="font-semibold">{tone.name}</span>
                        <span className="text-sm text-text-secondary mt-1">{tone.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Input */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-text-primary mb-4">
                Your Notes
              </label>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste or type your notes here..."
                  rows={8}
                  className="w-full rounded-xl bg-background/50 backdrop-blur-sm border-2 border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20 p-4 transition-all"
                  required
                />
                <div className="absolute bottom-4 right-4 text-text-secondary text-sm">
                  {notes.length} characters
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center reveal-animation">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!projectName || !selectedIndustry || !selectedTemplate || selectedTones.length === 0 || isLoading}
              className="epic-button w-full mt-8 flex items-center justify-center px-8 py-6 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  <span>Crafting Your Masterpiece...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-6 w-6 mr-3" />
                  <span>Transform Your Notes</span>
                </>
              )}
            </button>

            {/* Generated Content */}
            {generatedContent && (
              <div className="mt-8 p-6 bg-background/50 backdrop-blur-sm rounded-xl border-2 border-accent-purple/30 reveal-animation">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-6 w-6 text-accent-purple mr-2 sparkle-animation" />
                  <h2 className="text-lg font-semibold text-accent-purple">Your Polished Masterpiece</h2>
                </div>
                <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                  {generatedContent}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewProject;