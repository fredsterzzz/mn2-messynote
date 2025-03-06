import React from 'react';
import { Sparkles, FileText, Briefcase, Layout, MessageSquare, Wand2 } from 'lucide-react';

interface EpicProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { icon: FileText, label: 'Name Your Epic Project' },
  { icon: Briefcase, label: 'Select Your Realm of Genius' },
  { icon: Layout, label: 'Pick Your Creative Blueprint' },
  { icon: MessageSquare, label: 'Infuse Your Voice with Power' },
  { icon: Wand2, label: 'Transform Your Notes' },
];

export default function EpicProgress({ currentStep, totalSteps }: EpicProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent-purple animate-sparkle" />
        <span className="text-lg font-medium">Your Epic Quest Progress</span>
      </div>
      
      <div className="epic-progress">
        <div 
          className="epic-progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div 
              key={index}
              className={`flex flex-col items-center text-center transition-all duration-300 ${
                isActive ? 'text-accent-purple' : 
                isCurrent ? 'text-text-primary animate-pulse' : 
                'text-text-secondary/50'
              }`}
            >
              <div className={`p-2 rounded-lg mb-2 ${
                isActive ? 'bg-gradient-card shadow-glow-sm' :
                isCurrent ? 'border border-accent-purple/20' :
                'bg-background-secondary'
              }`}>
                <Icon className={`h-6 w-6 ${
                  isActive ? 'animate-bounce-gentle' : ''
                }`} />
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
