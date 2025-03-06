import React from 'react';
import { X, Sparkles, FileText, Briefcase, Layout, MessageSquare, Wand2 } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const steps = [
    {
      icon: FileText,
      title: 'Name Your Project',
      description: 'Start by giving your project a clear name.',
    },
    {
      icon: Briefcase,
      title: 'Choose Industry',
      description: 'Select the industry that best matches your content.',
    },
    {
      icon: Layout,
      title: 'Pick Template',
      description: 'Choose a template that fits your needs.',
    },
    {
      icon: MessageSquare,
      title: 'Set Tone',
      description: 'Select the tone that matches your style.',
    },
    {
      icon: Wand2,
      title: 'Add Notes',
      description: 'Paste your notes and watch them transform!',
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative max-w-2xl w-full mx-4 bg-background rounded-xl border border-accent-purple/20 p-8 shadow-glow-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-accent-purple animate-pulse" />
            <h2 className="text-3xl font-bold">
              Welcome to MessyNotes
            </h2>
          </div>
          <p className="text-text-secondary">Transform your notes into polished content in 5 simple steps</p>
        </div>

        <div className="grid gap-6 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg border border-accent-purple/10 bg-background-secondary hover:border-accent-purple/20 transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-orange/20">
                <step.icon className="h-5 w-5 text-accent-purple" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full epic-button"
        >
          <Sparkles className="h-5 w-5" />
          <span>Let's Get Started</span>
        </button>
      </div>
    </div>
  );
}
