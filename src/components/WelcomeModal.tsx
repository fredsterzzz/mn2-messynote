import React from 'react';
import { X, Sparkles, FileText, Briefcase, Layout, MessageSquare, Wand2, Star } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const steps = [
    {
      icon: FileText,
      title: 'Name Your Epic Project',
      description: 'Begin your journey with an inspiring name.',
      example: 'e.g., "My Study Guide Quest"',
      animation: 'animate-bounce-gentle'
    },
    {
      icon: Briefcase,
      title: 'Choose Your Realm',
      description: 'Select your domain of expertise.',
      example: 'e.g., Education, Technology, Business',
      animation: 'animate-pulse'
    },
    {
      icon: Layout,
      title: 'Pick Your Canvas',
      description: 'Choose the perfect template for your masterpiece.',
      example: 'e.g., Academic Paper, Business Document',
      animation: 'animate-scale'
    },
    {
      icon: MessageSquare,
      title: 'Set Your Voice',
      description: 'Define your unique tone and style.',
      example: 'e.g., Professional, Creative, Casual',
      animation: 'animate-bounce-gentle'
    },
    {
      icon: Wand2,
      title: 'Unleash Your Ideas',
      description: 'Watch your notes transform into brilliance!',
      example: 'From scattered thoughts to polished content',
      animation: 'animate-pulse'
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative max-w-3xl w-full mx-4 bg-gradient-cosmic rounded-xl border border-accent-purple/20 p-8 shadow-glow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="h-8 w-8 text-accent-orange animate-spin-slow" />
            <Sparkles className="h-8 w-8 text-accent-purple animate-pulse" />
            <h2 className="text-3xl font-bold font-display bg-gradient-to-r from-accent-purple to-accent-orange bg-clip-text text-transparent">
              Embark on Your Epic Journey!
            </h2>
            <Sparkles className="h-8 w-8 text-accent-purple animate-pulse" />
            <Star className="h-8 w-8 text-accent-orange animate-spin-slow" />
          </div>
          <p className="text-xl text-text-secondary">
            Transform your notes into brilliance in 5 magical steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="epic-card group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`p-4 rounded-full bg-gradient-card inline-block mb-4 ${step.animation}`}>
                {React.createElement(step.icon, {
                  className: "h-6 w-6 text-accent-purple"
                })}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-text-secondary mb-2">{step.description}</p>
              <p className="text-sm text-accent-purple/60 italic">{step.example}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="epic-button bg-gradient-cta group"
          >
            <Sparkles className="h-5 w-5 group-hover:animate-spin" />
            <span>Let's Begin Your Quest!</span>
            <Wand2 className="h-5 w-5 group-hover:animate-bounce" />
          </button>
        </div>

        {/* Before & After Demo */}
        <div className="mt-8 p-4 bg-background/50 rounded-lg border border-accent-purple/20">
          <div className="text-center text-sm text-text-secondary">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 p-3 bg-background rounded border border-accent-purple/20">
                <h4 className="font-bold mb-2">Before</h4>
                <p className="font-handwriting text-left">
                  meeting w/ team - discuss project timeline, review goals, assign tasks, next steps???
                </p>
              </div>
              <Wand2 className="h-6 w-6 text-accent-purple animate-pulse" />
              <div className="flex-1 p-3 bg-background rounded border border-accent-purple/20">
                <h4 className="font-bold mb-2">After</h4>
                <p className="text-left">
                  Team Meeting Summary:<br/>
                  • Project Timeline Review<br/>
                  • Goal Assessment<br/>
                  • Task Assignments<br/>
                  • Action Items & Next Steps
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
