import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Wand2, Loader2, AlertCircle, Car, Home, Briefcase, ShoppingBag, FileEdit, PenTool, Presentation, BookOpen } from 'lucide-react';
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
        </div>

        {mode === 'freeform' ? (
          <>
            {/* Grid of Content Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                    {template.icon === '💼' && <Briefcase className="h-6 w-6" />}
                    {template.icon === '📝' && <FileText className="h-6 w-6" />}
                    {template.icon === '📈' && <PenTool className="h-6 w-6" />}
                    {template.icon === '🎓' && <BookOpen className="h-6 w-6" />}
                    {template.icon === '🎨' && <Wand2 className="h-6 w-6" />}
                    {template.icon === '⚙️' && <FileEdit className="h-6 w-6" />}
                    {template.icon === '👥' && <FileText className="h-6 w-6" />}
                    {template.icon === '🎯' && <Presentation className="h-6 w-6" />}
                    <span className="mt-2">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Tone Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        ) : (
          <div>
            {/* Template Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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