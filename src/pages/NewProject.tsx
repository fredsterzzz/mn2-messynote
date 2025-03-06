import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Wand2, Loader2, AlertCircle, MessageSquare, Briefcase, FileEdit, PenTool, Presentation, BookOpen, Sparkles } from 'lucide-react';
import { industries, Industry } from '../data/industries';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { transformNotes } from '../services/openai';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';
import EpicProgress from '../components/EpicProgress';
import EpicTooltip from '../components/EpicTooltip';
import WelcomeModal from '../components/WelcomeModal';

const templates = [
  {
    id: 'business',
    name: 'Business Document',
    description: 'Transform your notes into a professional business document',
    icon: Briefcase
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Turn your notes into an engaging creative piece',
    icon: PenTool
  },
  {
    id: 'academic',
    name: 'Academic Paper',
    description: 'Structure your notes into an academic format',
    icon: BookOpen
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Convert your notes into presentation slides',
    icon: Presentation
  }
];

const tones = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clear, formal, and business-appropriate',
    icon: Briefcase
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Friendly and conversational',
    icon: MessageSquare
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Detailed and precise technical language',
    icon: FileEdit
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Imaginative and expressive',
    icon: Sparkles
  }
];

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

  const handleIndustryChange = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
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
      navigate('/content/' + result.id);
    } catch (err) {
      setError('Failed to transform notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cosmic-gradient min-h-screen">
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />
        
        <div className="mb-8">
          <EpicProgress currentStep={currentStep} totalSteps={5} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Name */}
          <div className="epic-card">
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
          <div className="epic-card">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="epic-icon h-6 w-6" />
              <h2 className="text-2xl font-semibold">Select Your Realm of Genius</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industries.map((industry) => (
                <EpicTooltip 
                  key={industry.id}
                  content={industry.description || industry.name}
                >
                  <button
                    type="button"
                    onClick={() => handleIndustryChange(industry.id)}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedIndustry?.id === industry.id
                        ? 'border-accent-purple bg-gradient-card shadow-glow-sm'
                        : 'border-accent-purple/20 hover:border-accent-purple/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className={`h-6 w-6 ${
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
            <div className="epic-card">
              <div className="flex items-center gap-3 mb-6">
                <Presentation className="epic-icon h-6 w-6" />
                <h2 className="text-2xl font-semibold">Pick Your Creative Blueprint</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <EpicTooltip
                    key={template.id}
                    content={template.description}
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
                        {React.createElement(template.icon, {
                          className: `h-6 w-6 ${
                            selectedTemplate === template.id ? 'text-accent-purple animate-bounce-gentle' : 'text-text-secondary'
                          }`
                        })}
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
            <div className="epic-card">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="epic-icon h-6 w-6" />
                <h2 className="text-2xl font-semibold">Choose Your Voice</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="flex items-center gap-3">
                        {React.createElement(tone.icon, {
                          className: `h-6 w-6 ${
                            selectedTones.includes(tone.id) ? 'text-accent-purple animate-bounce-gentle' : 'text-text-secondary'
                          }`
                        })}
                        <span className="text-text-primary font-medium">{tone.name}</span>
                      </div>
                    </button>
                  </EpicTooltip>
                ))}
              </div>
            </div>
          )}

          {/* Notes Input */}
          {selectedTones.length > 0 && (
            <div className="epic-card">
              <div className="flex items-center gap-3 mb-6">
                <FileEdit className="epic-icon h-6 w-6" />
                <h2 className="text-2xl font-semibold">Your Notes</h2>
              </div>

              <EpicTooltip content="Paste your notes here and watch them transform into something amazing!">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="epic-input min-h-[200px]"
                  placeholder="Paste your notes here..."
                />
              </EpicTooltip>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !projectName || !selectedIndustry || !selectedTemplate || selectedTones.length === 0}
            className="epic-button w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Transforming...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                <span>Transform Notes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewProject;