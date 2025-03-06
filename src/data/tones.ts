export interface Tone {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview: string;
}

export const tones: Tone[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clear, formal, and business-appropriate language',
    icon: 'Briefcase',
    preview: 'Perfect for business documents and reports'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Imaginative and expressive writing style',
    icon: 'Sparkles',
    preview: 'Ideal for storytelling and creative pieces'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Precise and detailed technical language',
    icon: 'Code',
    preview: 'Great for documentation and guides'
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Friendly and conversational tone',
    icon: 'MessageSquare',
    preview: 'Perfect for blogs and social content'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Scholarly and research-focused writing',
    icon: 'GraduationCap',
    preview: 'Ideal for academic papers and research'
  },
  {
    id: 'persuasive',
    name: 'Persuasive',
    description: 'Convincing and action-oriented language',
    icon: 'Target',
    preview: 'Great for proposals and marketing'
  }
];
