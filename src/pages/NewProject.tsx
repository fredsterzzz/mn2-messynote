import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Wand2, Loader2, AlertCircle, Car, Home, Briefcase, ShoppingBag, FileEdit, PenTool, Presentation, BookOpen, Sparkles } from 'lucide-react';
import { industries, Industry, Template, Tone } from '../data/industries';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { transformNotes, templates, tones } from '../services/openai';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';
import EpicProgress from '../components/EpicProgress';
import EpicTooltip from '../components/EpicTooltip';
import WelcomeModal from '../components/WelcomeModal';

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
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Update current step based on form completion
    if (!projectName) {
      setCurrentStep(0);
    } else if (!selectedIndustry) {
      setCurrentStep(1);
    } else if (!selectedTemplate) {
      setCurrentStep(2);
    } else if (selectedTones.length === 0) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  }, [projectName, selectedIndustry, selectedTemplate, selectedTones]);

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
      setError('Please complete all steps before proceeding.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await transformNotes({
        notes,
        industry: selectedIndustry.id,
        template: selectedTemplate,
        tones: selectedTones,
      });

      setGeneratedContent(result);
      // Navigate to the generated content view
      navigate('/content/' + result.id);
    } catch (err) {
      setError('Failed to transform notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cosmic-gradient">
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />

        <EpicProgress currentStep={currentStep} totalSteps={5} />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Name */}
          <div className="epic-card animate-reveal">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="epic-icon h-6 w-6" />
              <h2 className="text-2xl font-semibold">Name Your Epic Project</h2>
            </div>
            
            <EpicTooltip content="Give your masterpiece an inspiring name that captures its essence!">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="epic-input"
                placeholder="e.g., My Study Guide Hero..."
              />
            </EpicTooltip>
          </div>

          {/* Industry Selection */}
          <div className="epic-card animate-reveal">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="epic-icon h-6 w-6" />
              <h2 className="text-2xl font-semibold">Select Your Realm of Genius</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industries.map((industry) => (
                <EpicTooltip 
                  key={industry.id}
                  content={industry.description}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const event = { target: { value: industry.id } } as React.ChangeEvent<HTMLSelectElement>;
                      handleIndustryChange(event);
                    }}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedIndustry?.id === industry.id
                        ? 'border-accent-purple bg-gradient-card shadow-glow-sm'
                        : 'border-accent-purple/20 hover:border-accent-purple/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <industry.icon className={`h-6 w-6 ${
                        selectedIndustry?.id === industry.id ? 'text-accent-purple animate-bounce-gentle' : 'text-text-secondary'
                      }`} />
                      <span className="text-text-primary font-medium">{industry.name}</span>
                    </div>
                  </button>
                </EpicTooltip>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          {selectedIndustry && (
            <div className="epic-card animate-reveal">
              <div className="flex items-center gap-3 mb-6">
                <Presentation className="epic-icon h-6 w-6" />
                <h2 className="text-2xl font-semibold">Pick Your Creative Blueprint</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <EpicTooltip
                    key={template.id}
                    content={
                      <div>
                        <p className="font-medium mb-2">{template.name}</p>
                        <p className="text-sm">{template.description}</p>
                      </div>
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedTemplate === template.id
                          ? 'border-accent-purple bg-gradient-card shadow-glow-sm'
                          : 'border-accent-purple/20 hover:border-accent-purple/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <template.icon className={`h-6 w-6 ${
                          selectedTemplate === template.id ? 'text-accent-purple animate-bounce-gentle' : 'text-text-secondary'
                        }`} />
                        <span className="text-text-primary font-medium">{template.name}</span>
                      </div>
                    </button>
                  </EpicTooltip>
                ))}
              </div>
            </div>
          )}

          {/* Tone Selection */}
          {selectedTemplate && (
            <div className="epic-card animate-reveal">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="epic-icon h-6 w-6" />
                <h2 className="text-2xl font-semibold">Infuse Your Voice with Power</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tones.map((tone) => (
                  <EpicTooltip
                    key={tone.id}
                    content={tone.description}
                  >
                    <button
                      type="button"
                      onClick={() => handleToneToggle(tone.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedTones.includes(tone.id)
                          ? 'border-accent-purple bg-gradient-card shadow-glow-sm'
                          : 'border-accent-purple/20 hover:border-accent-purple/40'
                      }`}
                    >
                      <span className={`font-medium ${
                        selectedTones.includes(tone.id) ? 'text-accent-purple' : 'text-text-secondary'
                      }`}>{tone.name}</span>
                    </button>
                  </EpicTooltip>
                ))}
              </div>
            </div>
          )}

          {/* Notes Input */}
          {selectedTones.length > 0 && (
            <div className="epic-card animate-reveal">
              <div className="flex items-center gap-3 mb-6">
                <Wand2 className="epic-icon h-6 w-6" />
                <h2 className="text-2xl font-semibold">Transform Your Notes</h2>
              </div>

              <EpicTooltip content="Paste your raw notes here and watch them transform into polished brilliance!">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your messy notes here and watch the magic happen..."
                  className="epic-input h-48 resize-none"
                />
              </EpicTooltip>

              <div className="mt-2 text-text-secondary text-sm">
                {notes.length} characters
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 flex items-center gap-2 animate-reveal">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !projectName || !selectedIndustry || !selectedTemplate || selectedTones.length === 0}
              className="epic-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Crafting Your Masterpiece...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Transform Your Notes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProject;