import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface EpicProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  {
    title: 'Name Your Project',
    description: 'Give your masterpiece a name'
  },
  {
    title: 'Choose Industry',
    description: 'Select your realm of genius'
  },
  {
    title: 'Pick Template',
    description: 'Choose your creative blueprint'
  },
  {
    title: 'Set Tone',
    description: 'Define your unique voice'
  },
  {
    title: 'Add Notes',
    description: 'Share your raw ideas'
  }
];

const EpicProgress: React.FC<EpicProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-background-secondary transform -translate-y-1/2">
        <div 
          className="h-full bg-gradient-cta transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div 
              key={step.title}
              className={`flex flex-col items-center ${
                isCurrent ? 'animate-bounce-gentle' : ''
              }`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                          transition-all duration-300 ${
                  isCompleted ? 'bg-accent-purple text-white' :
                  isCurrent ? 'bg-gradient-cta text-white shadow-glow-sm' :
                  'bg-background-secondary text-text-secondary'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              
              <div className="absolute mt-12 text-center w-32 -ml-16">
                <p className={`font-medium mb-1 ${
                  isCurrent ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {step.title}
                </p>
                <p className="text-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EpicProgress;
