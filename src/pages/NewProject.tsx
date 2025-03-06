import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Wand2, Loader2, AlertCircle, MessageSquare, Briefcase, 
  FileEdit, PenTool, Presentation, BookOpen, Sparkles, Star, 
  Rocket, ChevronRight, Volume2, VolumeX
} from 'lucide-react';
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
    icon: Briefcase,
    preview: 'From meeting notes to polished reports!'
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Turn your notes into an engaging creative piece',
    icon: PenTool,
    preview: 'From ideas to captivating stories!'
  },
  {
    id: 'academic',
    name: 'Academic Paper',
    description: 'Structure your notes into an academic format',
    icon: BookOpen,
    preview: 'From study notes to stellar papers!'
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Convert your notes into presentation slides',
    icon: Presentation,
    preview: 'From bullet points to epic slides!'
  }
];

const tones = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clear, formal, and business-appropriate',
    icon: Briefcase,
    preview: 'Perfect for business documents and reports'
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Friendly and conversational',
    icon: MessageSquare,
    preview: 'Great for blogs and social content'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Detailed and precise technical language',
    icon: FileEdit,
    preview: 'Ideal for documentation and guides'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Imaginative and expressive',
    icon: Sparkles,
    preview: 'Perfect for storytelling and creative pieces'
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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    if (soundEnabled) {
      new Audio('/sounds/click.mp3').play().catch(() => {});
    }
    setSelectedIndustry(industry || null);
    setSelectedTemplate('');
    setSelectedTones([]);
  };

  const handleToneToggle = (toneId: string) => {
    if (soundEnabled) {
      new Audio('/sounds/toggle.mp3').play().catch(() => {});
    }
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

    if (soundEnabled) {
      new Audio('/sounds/transform.mp3').play().catch(() => {});
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
        <div className="flex items-center justify-between mb-8">
          <BackButton />
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="epic-button-secondary"
            title={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="mb-8">
          <EpicProgress currentStep={currentStep} totalSteps={5} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Name */}
          <div className="epic-card">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="epic-icon h-6 w-6 animate-bounce-gentle" />
              <h2 className="text-2xl font-bold font-display">Name Your Epic Project</h2>
            </div>
            
            <EpicTooltip content="Give your masterpiece an inspiring name that captures its essence!">
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (soundEnabled) {
                    new Audio('/sounds/type.mp3').play().catch(() => {});
                  }
                }}
                className="epic-input font-handwriting text-lg"
                placeholder="e.g., My Study Guide Quest..."
              />
            </EpicTooltip>
          </div>

          {/* Industry Selection */}
          <div className="epic-card">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="epic-icon h-6 w-6 animate-pulse" />
              <h2 className="text-2xl font-bold font-display">Select Your Realm of Genius</h2>
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
                <Presentation className="epic-icon h-6 w-6 animate-scale" />
                <h2 className="text-2xl font-bold font-display">Pick Your Creative Blueprint</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <EpicTooltip
                    key={template.id}
                    content={
                      <div className="space-y-2">
                        <p>{template.description}</p>
                        <p className="text-accent-purple">{template.preview}</p>
                      </div>
                    }
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        if (soundEnabled) {
                          new Audio('/sounds/select.mp3').play().catch(() => {});
                        }
                      }}
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
                <MessageSquare className="epic-icon h-6 w-6 animate-bounce-gentle" />
                <h2 className="text-2xl font-bold font-display">Shape Your Unique Voice</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tones.map((tone) => (
                  <EpicTooltip
                    key={tone.id}
                    content={
                      <div className="space-y-2">
                        <p>{tone.description}</p>
                        <p className="text-accent-purple">{tone.preview}</p>
                      </div>
                    }
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
                <FileEdit className="epic-icon h-6 w-6 animate-pulse" />
                <h2 className="text-2xl font-bold font-display">Unleash Your Ideas</h2>
              </div>

              <EpicTooltip content="Drop your raw ideas here and watch them transform into something amazing!">
                <div className="space-y-4">
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      if (soundEnabled) {
                        new Audio('/sounds/type.mp3').play().catch(() => {});
                      }
                    }}
                    className="epic-input min-h-[200px] font-handwriting"
                    placeholder="Drop your raw ideas here... Watch the magic unfold!"
                  />
                  
                  {notes && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="epic-button-secondary w-full"
                    >
                      <Star className="h-5 w-5" />
                      <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
                    </button>
                  )}

                  {showPreview && notes && (
                    <div className="p-4 bg-background/50 rounded-lg border border-accent-purple/20">
                      <div className="text-center text-sm text-text-secondary">
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex-1 p-3 bg-background rounded border border-accent-purple/20">
                            <h4 className="font-bold mb-2">Your Notes</h4>
                            <p className="font-handwriting text-left">
                              {notes}
                            </p>
                          </div>
                          <Wand2 className="h-6 w-6 text-accent-purple animate-pulse" />
                          <div className="flex-1 p-3 bg-background rounded border border-accent-purple/20">
                            <h4 className="font-bold mb-2">Preview</h4>
                            <p className="text-left opacity-50">
                              Your notes will be transformed into a polished {selectedTemplate} with a {selectedTones.join(', ')} tone!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
            className="epic-button w-full bg-gradient-cta group"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Crafting Your Masterpiece...</span>
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                <span>Unleash Your Masterpiece Now!</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewProject;