import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { industries } from '../data/industries';
import { tones } from '../data/tones';
import EpicProgress from '../components/EpicProgress';
import EpicTooltip from '../components/EpicTooltip';
import { Sparkles, Info } from 'lucide-react';

export default function NewProject() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement project creation
    navigate('/dashboard');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return projectName.length > 0;
      case 1:
        return selectedIndustry !== null;
      case 2:
        return selectedTemplate !== null;
      case 3:
        return selectedTones.length > 0;
      case 4:
        return notes.length > 0;
      default:
        return false;
    }
  };

  const selectedIndustryData = industries.find(i => i.id === selectedIndustry);
  const templates = selectedIndustryData?.templates || [];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">Name Your Masterpiece</h2>
            <div className="space-y-2">
              <label className="block text-text-secondary">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter a name for your project..."
                className="w-full p-3 bg-background-secondary rounded-lg border border-accent-purple/20 
                         focus:border-accent-purple focus:ring-1 focus:ring-accent-purple outline-none
                         placeholder:text-text-secondary/50"
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Choose Your Realm of Genius</h2>
            <div className="grid grid-cols-2 gap-4">
              {industries.map((industry) => (
                <EpicTooltip
                  key={industry.id}
                  content={industry.description}
                  position="right"
                >
                  <button
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                      selectedIndustry === industry.id
                        ? 'bg-gradient-cta border-accent-purple shadow-glow-sm'
                        : 'bg-background-secondary border-accent-purple/20 hover:border-accent-purple/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{industry.name}</span>
                      {selectedIndustry === industry.id && (
                        <Sparkles className="w-5 h-5 text-accent-purple animate-pulse" />
                      )}
                    </div>
                  </button>
                </EpicTooltip>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Choose Your Creative Blueprint</h2>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <EpicTooltip
                  key={template.id}
                  content={
                    <div className="space-y-2">
                      <p>{template.description}</p>
                      <p className="text-accent-purple">{template.preview}</p>
                    </div>
                  }
                  position="right"
                >
                  <button
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? 'bg-gradient-cta border-accent-purple shadow-glow-sm'
                        : 'bg-background-secondary border-accent-purple/20 hover:border-accent-purple/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{template.name}</span>
                      {selectedTemplate === template.id && (
                        <Sparkles className="w-5 h-5 text-accent-purple animate-pulse" />
                      )}
                    </div>
                  </button>
                </EpicTooltip>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Define Your Voice</h2>
            <div className="grid grid-cols-2 gap-4">
              {tones.map((tone) => (
                <EpicTooltip
                  key={tone.id}
                  content={
                    <div className="space-y-2">
                      <p>{tone.description}</p>
                      <p className="text-accent-purple">{tone.preview}</p>
                    </div>
                  }
                  position="right"
                >
                  <button
                    onClick={() => {
                      if (selectedTones.includes(tone.id)) {
                        setSelectedTones(selectedTones.filter(id => id !== tone.id));
                      } else if (selectedTones.length < 2) {
                        setSelectedTones([...selectedTones, tone.id]);
                      }
                    }}
                    className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                      selectedTones.includes(tone.id)
                        ? 'bg-gradient-cta border-accent-purple shadow-glow-sm'
                        : 'bg-background-secondary border-accent-purple/20 hover:border-accent-purple/50'
                    }`}
                    disabled={selectedTones.length >= 2 && !selectedTones.includes(tone.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{tone.name}</span>
                      {selectedTones.includes(tone.id) && (
                        <Sparkles className="w-5 h-5 text-accent-purple animate-pulse" />
                      )}
                    </div>
                  </button>
                </EpicTooltip>
              ))}
            </div>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <Info className="w-4 h-4" />
              Select up to 2 tones to blend
            </p>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">Share Your Raw Ideas</h2>
            <div className="space-y-2">
              <label className="block text-text-secondary">Your Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your messy notes here..."
                className="w-full h-64 p-3 bg-background-secondary rounded-lg border border-accent-purple/20 
                         focus:border-accent-purple focus:ring-1 focus:ring-accent-purple outline-none
                         placeholder:text-text-secondary/50 resize-none"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12">
        <EpicProgress currentStep={currentStep} totalSteps={5} />
      </div>

      <div className="mb-8">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className={`px-6 py-2 rounded-lg transition-all duration-300 ${
            currentStep === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-background-secondary'
          }`}
          disabled={currentStep === 0}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`px-6 py-2 rounded-lg transition-all duration-300 ${
            isStepValid()
              ? 'bg-gradient-cta hover:shadow-glow-sm'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {currentStep === 4 ? 'Create Project' : 'Next'}
        </button>
      </div>
    </div>
  );
}