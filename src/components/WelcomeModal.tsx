import React from 'react';
import { Sparkles, FileText, Briefcase, Layout, MessageSquare, Wand2 } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const steps = [
    {
      icon: FileText,
      title: 'Name Your Epic Project',
      description: 'Begin your journey by giving your masterpiece a name.',
    },
    {
      icon: Briefcase,
      title: 'Select Your Realm',
      description: 'Choose your domain of expertise from our curated realms.',
    },
    {
      icon: Layout,
      title: 'Pick Your Blueprint',
      description: 'Select a template that matches your creative vision.',
    },
    {
      icon: MessageSquare,
      title: 'Set Your Tone',
      description: 'Infuse your content with the perfect voice and style.',
    },
    {
      icon: Wand2,
      title: 'Transform',
      description: 'Watch as your notes transform into polished brilliance!',
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="max-w-2xl w-full mx-4 bg-background-secondary rounded-xl border border-accent-purple/20 p-8 shadow-glow-lg animate-scale">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-accent-purple animate-sparkle" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Welcome to MessyNotes.ai
            </h2>
          </div>
          <p className="text-text-secondary">Your Epic Journey to Polished Content Begins Here!</p>
        </div>

        <div className="grid gap-6 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start gap-4 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-2 rounded-lg bg-gradient-card shadow-glow-sm">
                  <Icon className="h-6 w-6 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{step.title}</h3>
                  <p className="text-text-secondary text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="epic-button"
          >
            <Sparkles className="h-5 w-5" />
            Begin Your Epic Journey
          </button>
        </div>
      </div>
    </div>
  );
}
