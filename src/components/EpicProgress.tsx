import React from 'react';
import { Sparkles, FileText, Briefcase, Layout, MessageSquare, Wand2 } from 'lucide-react';

interface EpicProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { icon: FileText, label: 'Name Your Project' },
  { icon: Briefcase, label: 'Choose Industry' },
  { icon: Layout, label: 'Select Template' },
  { icon: MessageSquare, label: 'Pick Tone' },
  { icon: Wand2, label: 'Add Notes' },
];

export default function EpicProgress({ currentStep, totalSteps }: EpicProgressProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent-purple animate-pulse" />
        <span className="text-lg font-medium">Your Progress</span>
      </div>
      
      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-accent-purple to-accent-orange transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div 
              key={index}
              className={`flex flex-col items-center text-center transition-all duration-300 ${
                isCompleted ? 'text-accent-purple' : 
                isCurrent ? 'text-text-primary' : 
                'text-text-secondary/50'
              }`}
            >
              <div className={`p-2 rounded-lg mb-2 ${
                isCompleted ? 'bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 shadow-glow-sm' :
                isCurrent ? 'border border-accent-purple animate-pulse' :
                'border border-text-secondary/10'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
