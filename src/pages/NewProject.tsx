import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Wand2, Loader2, AlertCircle, Car, Home, Briefcase, ShoppingBag, FileEdit, PenTool, Presentation, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { transformNotes, templates, tones } from '../services/openai';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

const taskTemplates = [
  {
    id: 'vehicle-sale',
    name: 'Sell a Vehicle',
    icon: <Car className="h-6 w-6" />,
    fields: [
      { name: 'make', label: 'Make', placeholder: 'e.g., Toyota' },
      { name: 'model', label: 'Model', placeholder: 'e.g., Camry' },
      { name: 'year', label: 'Year', placeholder: 'e.g., 2020' },
      { name: 'mileage', label: 'Mileage', placeholder: 'e.g., 50,000' },
      { name: 'condition', label: 'Condition', placeholder: 'e.g., Excellent, minor wear' },
      { name: 'features', label: 'Key Features', placeholder: 'e.g., Leather seats, sunroof, navigation' },
      { name: 'price', label: 'Asking Price', placeholder: 'e.g., $15,000' },
      { name: 'location', label: 'Location', placeholder: 'e.g., San Francisco, CA' },
      { name: 'contact', label: 'Contact Info', placeholder: 'e.g., Email or phone number' }
    ]
  },
  {
    id: 'property-rental',
    name: 'Rent a Property',
    icon: <Home className="h-6 w-6" />,
    fields: [
      { name: 'type', label: 'Property Type', placeholder: 'e.g., Apartment, House, Studio' },
      { name: 'bedrooms', label: 'Bedrooms', placeholder: 'e.g., 2' },
      { name: 'bathrooms', label: 'Bathrooms', placeholder: 'e.g., 1.5' },
      { name: 'size', label: 'Size', placeholder: 'e.g., 1000 sq ft' },
      { name: 'rent', label: 'Monthly Rent', placeholder: 'e.g., $2,000' },
      { name: 'deposit', label: 'Security Deposit', placeholder: 'e.g., $2,000' },
      { name: 'utilities', label: 'Utilities Included', placeholder: 'e.g., Water, gas, internet' },
      { name: 'amenities', label: 'Amenities', placeholder: 'e.g., Parking, laundry, gym' },
      { name: 'location', label: 'Location', placeholder: 'e.g., Downtown area' },
      { name: 'availability', label: 'Available From', placeholder: 'e.g., March 1st, 2024' }
    ]
  },
  {
    id: 'job-posting',
    name: 'Post a Job',
    icon: <Briefcase className="h-6 w-6" />,
    fields: [
      { name: 'title', label: 'Job Title', placeholder: 'e.g., Senior Software Engineer' },
      { name: 'company', label: 'Company Name', placeholder: 'e.g., Tech Solutions Inc.' },
      { name: 'location', label: 'Location', placeholder: 'e.g., Remote, New York, NY' },
      { name: 'type', label: 'Employment Type', placeholder: 'e.g., Full-time, Contract' },
      { name: 'salary', label: 'Salary Range', placeholder: 'e.g., $100,000 - $130,000' },
      { name: 'requirements', label: 'Requirements', placeholder: 'e.g., 5+ years experience, Bachelor\'s degree' },
      { name: 'responsibilities', label: 'Responsibilities', placeholder: 'e.g., Lead development team, architect solutions' },
      { name: 'benefits', label: 'Benefits', placeholder: 'e.g., Health insurance, 401k, unlimited PTO' },
      { name: 'contact', label: 'How to Apply', placeholder: 'e.g., Email resume to jobs@company.com' }
    ]
  },
  {
    id: 'product-listing',
    name: 'Sell a Product',
    icon: <ShoppingBag className="h-6 w-6" />,
    fields: [
      { name: 'name', label: 'Product Name', placeholder: 'e.g., Vintage Camera' },
      { name: 'category', label: 'Category', placeholder: 'e.g., Electronics, Furniture' },
      { name: 'condition', label: 'Condition', placeholder: 'e.g., New, Like New, Used' },
      { name: 'price', label: 'Price', placeholder: 'e.g., $150' },
      { name: 'description', label: 'Description', placeholder: 'Describe your product in detail...' },
      { name: 'features', label: 'Features', placeholder: 'e.g., Brand, model, specifications' },
      { name: 'shipping', label: 'Shipping Options', placeholder: 'e.g., Free shipping, Local pickup' },
      { name: 'location', label: 'Location', placeholder: 'e.g., Los Angeles, CA' },
      { name: 'contact', label: 'Contact Info', placeholder: 'e.g., Email or phone number' }
    ]
  }
];

function NewProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { credits, checkCredits } = useCredits();
  const [mode, setMode] = useState<'freeform' | 'task'>('freeform');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedType, setSelectedType] = useState('business');
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateContent = async () => {
    if (mode === 'task' && !selectedTemplate) {
      setError('Please select a template');
      return;
    }

    if (mode === 'task') {
      const template = taskTemplates.find(t => t.id === selectedTemplate);
      if (!template) return;

      const missingFields = template.fields.filter(
        field => !formData[field.name] || formData[field.name].trim() === ''
      );

      if (missingFields.length > 0) {
        setError(`Please fill in all fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }
    } else if (!notes.trim()) {
      setError('Please enter your notes');
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

      let contentToTransform = '';
      if (mode === 'task') {
        const template = taskTemplates.find(t => t.id === selectedTemplate);
        contentToTransform = template?.fields.map(
          field => `${field.label}: ${formData[field.name]}`
        ).join('\n') || '';
      } else {
        contentToTransform = notes;
      }

      const result = await transformNotes(
        contentToTransform,
        selectedType,
        selectedTone
      );

      setGeneratedContent(result);
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
        
        {/* Welcome Banner */}
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

          {/* Mode Selection */}
          <div className="flex space-x-4 mb-8 reveal-animation reveal-delay-3">
            <button
              onClick={() => {
                setMode('freeform');
                setSelectedTemplate('');
                setFormData({});
                setGeneratedContent('');
              }}
              className={`flex-1 epic-button flex items-center justify-center p-6 rounded-xl transition-all ${
                mode === 'freeform'
                  ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                  : 'border-accent-purple/20 hover:border-accent-purple/40'
              }`}
            >
              <div className="text-center">
                <PenTool className="h-8 w-8 mx-auto mb-2 float-animation" />
                <span className="block font-semibold">Freeform Notes</span>
                <span className="text-sm text-text-secondary mt-1 block">Unleash your creativity!</span>
              </div>
            </button>
            <button
              onClick={() => {
                setMode('task');
                setNotes('');
                setGeneratedContent('');
              }}
              className={`flex-1 epic-button flex items-center justify-center p-6 rounded-xl transition-all ${
                mode === 'task'
                  ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                  : 'border-accent-purple/20 hover:border-accent-purple/40'
              }`}
            >
              <div className="text-center">
                <FileEdit className="h-8 w-8 mx-auto mb-2 float-animation" />
                <span className="block font-semibold">Task Helper</span>
                <span className="text-sm text-text-secondary mt-1 block">Guided excellence!</span>
              </div>
            </button>
          </div>

          {mode === 'freeform' ? (
            <>
              {/* Content Types */}
              <div className="mb-8 reveal-animation reveal-delay-4">
                <h2 className="text-lg font-semibold mb-4 text-text-primary">Choose Your Quest</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {templates.map((template, index) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedType(template.id)}
                      className={`epic-card p-6 rounded-xl border-2 text-center transition-all ${
                        selectedType === template.id
                          ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                          : 'border-accent-purple/20 hover:border-accent-purple/40'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 mb-3 float-animation">
                          {template.icon === '💼' && <Briefcase className="h-full w-full" />}
                          {template.icon === '📝' && <FileText className="h-full w-full" />}
                          {template.icon === '📈' && <PenTool className="h-full w-full" />}
                          {template.icon === '🎓' && <BookOpen className="h-full w-full" />}
                          {template.icon === '🎨' && <Wand2 className="h-full w-full" />}
                          {template.icon === '⚙️' && <FileEdit className="h-full w-full" />}
                          {template.icon === '👥' && <FileText className="h-full w-full" />}
                          {template.icon === '🎯' && <Presentation className="h-full w-full" />}
                        </div>
                        <span className="font-semibold">{template.name}</span>
                        <span className="text-sm text-text-secondary mt-1">{template.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-text-primary">Set the Tone</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`epic-card p-6 rounded-xl border-2 text-center transition-all ${
                        selectedTone === tone.id
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
                  />
                  <div className="absolute bottom-4 right-4 text-text-secondary text-sm">
                    {notes.length} characters
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="reveal-animation">
              {/* Template Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {taskTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setFormData({});
                      setGeneratedContent('');
                    }}
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
                    </div>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="space-y-6 reveal-animation">
                  {taskTemplates
                    .find(t => t.id === selectedTemplate)
                    ?.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl bg-background/50 backdrop-blur-sm border-2 border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20 p-4 transition-all"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center reveal-animation">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <button
            onClick={generateContent}
            disabled={isLoading}
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
        </div>
      </div>
    </div>
  );
}

export default NewProject;