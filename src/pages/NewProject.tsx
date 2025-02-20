import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { industries, Industry, Template, Tone } from '../data/industries';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function NewProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setError('');
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to create a project');
      }

      if (!selectedIndustry || !selectedTemplate || selectedTones.length === 0) {
        throw new Error('Please fill in all required fields');
      }

      const template = selectedIndustry.templates.find(t => t.id === selectedTemplate);
      const tones = selectedIndustry.tones.filter(t => selectedTones.includes(t.id));

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name: projectName,
            user_id: user.id,
            industry: selectedIndustry.id,
            template: {
              id: template?.id,
              name: template?.name,
              description: template?.description
            },
            tones: tones.map(t => ({
              id: t.id,
              name: t.name,
              description: t.description
            })),
            status: 'active',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <label htmlFor="projectName" className="block text-sm font-medium">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="industry" className="block text-sm font-medium">
            Industry/Career
          </label>
          <select
            id="industry"
            onChange={handleIndustryChange}
            className="w-full px-3 py-2 border rounded-md"
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

        {selectedIndustry && (
          <>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Structure</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedIndustry.templates.map((template: Template) => (
                  <div 
                    key={template.id}
                    className={`p-4 border rounded-md cursor-pointer ${
                      selectedTemplate === template.id ? 'border-purple-500 bg-purple-50' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Tone</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedIndustry.tones.map((tone: Tone) => (
                  <div 
                    key={tone.id}
                    className="flex items-start space-x-3"
                  >
                    <input
                      type="checkbox"
                      id={tone.id}
                      checked={selectedTones.includes(tone.id)}
                      onChange={() => handleToneToggle(tone.id)}
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor={tone.id} className="font-semibold">
                        {tone.name}
                      </label>
                      <p className="text-sm text-gray-600">{tone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="p-4 text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!projectName || !selectedIndustry || !selectedTemplate || selectedTones.length === 0 || isLoading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}