import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Wand2, Loader2, AlertCircle, Car, Home, Briefcase, 
  ShoppingBag, FileEdit, PenTool, Presentation, BookOpen, 
  GraduationCap, Sparkles, FileSearch, PencilRuler, Users,
  Calendar, GraduationCap as Resume, LightbulbIcon, Building2,
  Camera, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { transformNotes, templates, tones } from '../services/openai';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';
import { createWorker } from 'tesseract.js';

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
  },
  {
    id: 'event-planning',
    name: 'Plan Event',
    icon: <Calendar className="h-6 w-6" />,
    fields: [
      { name: 'name', label: 'Event Name', placeholder: 'e.g., Annual Tech Conference' },
      { name: 'date', label: 'Date', placeholder: 'e.g., October 15-16, 2024' },
      { name: 'location', label: 'Location', placeholder: 'e.g., Convention Center, City' },
      { name: 'attendees', label: 'Expected Attendees', placeholder: 'e.g., 500' },
      { name: 'description', label: 'Event Description', placeholder: 'Brief description of the event...' },
      { name: 'schedule', label: 'Schedule', placeholder: 'Key timeline and activities' },
      { name: 'budget', label: 'Budget', placeholder: 'e.g., $50,000' },
      { name: 'requirements', label: 'Special Requirements', placeholder: 'e.g., AV equipment, catering' }
    ]
  },
  {
    id: 'resume',
    name: 'Build Resume',
    icon: <Resume className="h-6 w-6" />,
    fields: [
      { name: 'name', label: 'Full Name', placeholder: 'e.g., John Smith' },
      { name: 'title', label: 'Professional Title', placeholder: 'e.g., Senior Software Engineer' },
      { name: 'summary', label: 'Professional Summary', placeholder: 'Brief overview of your experience...' },
      { name: 'experience', label: 'Work Experience', placeholder: 'List your relevant work experience...' },
      { name: 'education', label: 'Education', placeholder: 'Your educational background...' },
      { name: 'skills', label: 'Skills', placeholder: 'Key technical and soft skills...' },
      { name: 'achievements', label: 'Achievements', placeholder: 'Notable accomplishments...' },
      { name: 'contact', label: 'Contact Information', placeholder: 'Email, phone, LinkedIn...' }
    ]
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    icon: <LightbulbIcon className="h-6 w-6" />,
    fields: [
      { name: 'title', label: 'Project Title', placeholder: 'e.g., Mobile App Development' },
      { name: 'summary', label: 'Executive Summary', placeholder: 'Brief overview of the project...' },
      { name: 'objectives', label: 'Objectives', placeholder: 'Key goals and outcomes...' },
      { name: 'scope', label: 'Project Scope', placeholder: 'What\'s included and excluded...' },
      { name: 'timeline', label: 'Timeline', placeholder: 'Major milestones and deadlines...' },
      { name: 'budget', label: 'Budget', placeholder: 'Cost breakdown and resources...' },
      { name: 'risks', label: 'Risks & Mitigation', placeholder: 'Potential risks and solutions...' },
      { name: 'team', label: 'Team & Resources', placeholder: 'Required team members and resources...' }
    ]
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    icon: <Building2 className="h-6 w-6" />,
    fields: [
      { name: 'name', label: 'Business Name', placeholder: 'e.g., Tech Solutions Inc.' },
      { name: 'summary', label: 'Executive Summary', placeholder: 'Brief overview of the business...' },
      { name: 'market', label: 'Market Analysis', placeholder: 'Target market and competition...' },
      { name: 'product', label: 'Product/Service', placeholder: 'Description of offerings...' },
      { name: 'strategy', label: 'Marketing Strategy', placeholder: 'How you\'ll reach customers...' },
      { name: 'operations', label: 'Operations Plan', placeholder: 'Day-to-day operations...' },
      { name: 'financials', label: 'Financial Projections', placeholder: 'Revenue, costs, funding needs...' },
      { name: 'team', label: 'Management Team', placeholder: 'Key team members and roles...' }
    ]
  }
];

function NewProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { credits, checkCredits } = useCredits();
  const [mode, setMode] = useState<'freeform' | 'task' | 'ocr'>('freeform');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedType, setSelectedType] = useState('business');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateContent = async () => {
    if (mode === 'task' && !selectedTemplate) {
      setError('Please select a template');
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
        if (!template) {
          setError('Template not found');
          return;
        }

        // Check if all required fields are filled
        const missingFields = template.fields.filter(
          field => !formData[field.name] || formData[field.name].trim() === ''
        );

        if (missingFields.length > 0) {
          setError(`Please fill in all fields: ${missingFields.map(f => f.label).join(', ')}`);
          return;
        }

        // Format the content for the task template
        contentToTransform = template.fields
          .map(field => `${field.label}: ${formData[field.name]}`)
          .join('\n');
      } else {
        if (!notes.trim()) {
          setError('Please enter your notes');
          return;
        }
        contentToTransform = notes;
      }

      const result = await transformNotes(
        contentToTransform,
        mode === 'task' ? 'business' : selectedType,
        mode === 'task' ? 'professional' : selectedTone
      );

      setGeneratedContent(result);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOCR = async (file: File) => {
    setIsLoading(true);
    setError('');
    setOcrProgress(0);

    try {
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(m.progress);
          }
        },
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      setOcrResult(text);
      setNotes(text);
      await worker.terminate();
    } catch (err) {
      setError('Error processing image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      
      <div className="bg-background-secondary rounded-xl border border-accent-purple/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-accent-purple mr-3" />
            <h1 className="text-2xl font-bold text-text-primary">New Project</h1>
          </div>
          {credits && (
            <div className="text-text-secondary">
              {credits.subscription_status === 'active' ? (
                <span className="text-accent-purple">Premium Plan</span>
              ) : (
                <span>Credits remaining: {credits.credits_remaining}</span>
              )}
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => {
              setMode('freeform');
              setSelectedTemplate('');
              setFormData({});
              setGeneratedContent('');
              setOcrResult('');
            }}
            className={`flex items-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              mode === 'freeform'
                ? 'border-accent-purple bg-background text-accent-purple'
                : 'border-accent-purple/20 hover:border-accent-purple/40'
            }`}
          >
            <PenTool className="h-6 w-6 mr-2" />
            <span>Freeform Notes</span>
          </button>
          
          <button
            onClick={() => {
              setMode('task');
              setNotes('');
              setGeneratedContent('');
              setOcrResult('');
            }}
            className={`flex items-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              mode === 'task'
                ? 'border-accent-purple bg-background text-accent-purple'
                : 'border-accent-purple/20 hover:border-accent-purple/40'
            }`}
          >
            <FileEdit className="h-6 w-6 mr-2" />
            <span>Task Helper</span>
          </button>

          <button
            onClick={() => {
              setMode('ocr');
              setNotes('');
              setGeneratedContent('');
              setOcrResult('');
            }}
            className={`flex items-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              mode === 'ocr'
                ? 'border-accent-purple bg-background text-accent-purple'
                : 'border-accent-purple/20 hover:border-accent-purple/40'
            }`}
          >
            <Camera className="h-6 w-6 mr-2" />
            <span>Extract Text</span>
          </button>
        </div>

        {mode === 'freeform' ? (
          <>
            {/* Template Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-accent-purple" />
                Select Template
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedType(template.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                      selectedType === template.id
                        ? 'border-accent-purple bg-background text-accent-purple'
                        : 'border-accent-purple/20 hover:border-accent-purple/40'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {template.id === 'business' && <Briefcase className="h-6 w-6" />}
                      {template.id === 'personal' && <FileText className="h-6 w-6" />}
                      {template.id === 'sales' && <PenTool className="h-6 w-6" />}
                      {template.id === 'academic' && <GraduationCap className="h-6 w-6" />}
                      {template.id === 'creative' && <Sparkles className="h-6 w-6" />}
                      {template.id === 'technical' && <FileEdit className="h-6 w-6" />}
                      {template.id === 'meeting' && <Users className="h-6 w-6" />}
                      {template.id === 'presentation' && <Presentation className="h-6 w-6" />}
                      {template.id === 'blog' && <PencilRuler className="h-6 w-6" />}
                      {template.id === 'research' && <FileSearch className="h-6 w-6" />}
                      <span className="mt-2">{template.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-accent-purple" />
                Select Tone
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                      selectedTone === tone.id
                        ? 'border-accent-purple bg-background text-accent-purple'
                        : 'border-accent-purple/20 hover:border-accent-purple/40'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-2">{tone.icon}</span>
                      <span>{tone.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Your Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste or type your notes here..."
                rows={8}
                className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
              />
            </div>
          </>
        ) : mode === 'task' ? (
          <div>
            {/* Template Categories */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Wand2 className="h-5 w-5 mr-2 text-accent-purple" />
                  Select Template
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* Toggle favorites */}}
                    className="p-2 rounded-lg border border-accent-purple/20 hover:border-accent-purple/40"
                    title="Show Favorites"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {/* Show preview */}}
                    className="p-2 rounded-lg border border-accent-purple/20 hover:border-accent-purple/40"
                    title="Preview Template"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {/* Create custom template */}}
                    className="p-2 rounded-lg border border-accent-purple/20 hover:border-accent-purple/40"
                    title="Create Custom Template"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {taskTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setFormData({});
                      setGeneratedContent('');
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                      selectedTemplate === template.id
                        ? 'border-accent-purple bg-background text-accent-purple'
                        : 'border-accent-purple/20 hover:border-accent-purple/40'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {template.icon}
                      <span className="mt-2">{template.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedTemplate && (
              <div className="space-y-6">
                {taskTemplates
                  .find(t => t.id === selectedTemplate)
                  ?.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg bg-background border-accent-purple/20 text-text-primary placeholder-text-secondary focus:border-accent-purple focus:ring focus:ring-accent-purple/20"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-semibold text-text-primary flex items-center">
                <Camera className="h-5 w-5 mr-2 text-accent-purple" />
                Extract Text from Images
              </h2>
              <p className="text-text-secondary">
                Upload an image containing text, and we'll extract it for you. Works best with clear, well-lit images.
              </p>

              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-accent-purple/20 rounded-lg bg-background hover:border-accent-purple/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleOCR(file);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center space-y-2"
                  disabled={isLoading}
                >
                  <Upload className="h-8 w-8 text-accent-purple" />
                  <span className="text-text-primary">Click to upload an image</span>
                  <span className="text-sm text-text-secondary">or drag and drop</span>
                </button>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-purple transition-all duration-300"
                      style={{ width: `${ocrProgress * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary">
                    Processing image... {Math.round(ocrProgress * 100)}%
                  </span>
                </div>
              )}

              {ocrResult && (
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-text-primary">Extracted Text</h3>
                  <div className="p-4 bg-background rounded-lg border border-accent-purple/20">
                    <pre className="whitespace-pre-wrap text-text-primary font-mono text-sm">
                      {ocrResult}
                    </pre>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setMode('freeform');
                        setNotes(ocrResult);
                      }}
                      className="px-4 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple/90"
                    >
                      Continue to Editor
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <button
          onClick={generateContent}
          disabled={isLoading}
          className="w-full mt-6 flex items-center justify-center px-8 py-4 bg-gradient-cta text-white rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Wand2 className="h-5 w-5 mr-2" />
          )}
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="mt-8 p-6 bg-background rounded-lg border border-accent-purple/20">
            <h2 className="text-lg font-semibold mb-4 text-accent-purple">Generated Content</h2>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewProject;