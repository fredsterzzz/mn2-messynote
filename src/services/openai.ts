import OpenAI from 'openai';
import { supabase } from '../lib/supabase';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true
});

const templatePrompts = {
  business: {
    icon: '💼',
    name: 'Business',
    prompt: "Transform into a clear business document maintaining professionalism and directness."
  },
  personal: {
    icon: '📝',
    name: 'Personal',
    prompt: "Organize into a clear personal document with actionable items and goals."
  },
  sales: {
    icon: '📈',
    name: 'Sales',
    prompt: "Convert into compelling sales content focusing on benefits and value propositions."
  },
  academic: {
    icon: '🎓',
    name: 'Academic',
    prompt: "Transform into an academic document using scholarly language and proper structure."
  },
  creative: {
    icon: '🎨',
    name: 'Creative',
    prompt: "Convert into creative content while maintaining the core message."
  },
  technical: {
    icon: '⚙️',
    name: 'Technical',
    prompt: "Transform into clear technical documentation with precise language."
  },
  meeting: {
    icon: '👥',
    name: 'Meeting',
    prompt: "Convert into a concise meeting summary with key points and action items."
  },
  presentation: {
    icon: '🎯',
    name: 'Presentation',
    prompt: "Transform into presentation content with clear sections."
  },
  blog: {
    icon: '✍️',
    name: 'Blog Post',
    prompt: "Convert into an engaging blog post format."
  },
  research: {
    icon: '🔬',
    name: 'Research',
    prompt: "Transform into a structured research document with clear methodology and findings."
  }
};

const toneModifiers = {
  professional: {
    icon: '👔',
    name: 'Professional',
    description: "Use formal, business-appropriate language"
  },
  casual: {
    icon: '😊',
    name: 'Casual',
    description: "Use relaxed, everyday language"
  },
  friendly: {
    icon: '🤝',
    name: 'Friendly',
    description: "Use warm, approachable language"
  },
  formal: {
    icon: '📚',
    name: 'Formal',
    description: "Use precise, academic language"
  },
  enthusiastic: {
    icon: '🌟',
    name: 'Enthusiastic',
    description: "Use energetic, positive language"
  },
  technical: {
    icon: '💻',
    name: 'Technical',
    description: "Use precise technical terminology"
  },
  conversational: {
    icon: '💭',
    name: 'Conversational',
    description: "Use natural, dialogue-like language"
  },
  authoritative: {
    icon: '🎯',
    name: 'Authoritative',
    description: "Use confident, expert language"
  },
  empathetic: {
    icon: '💝',
    name: 'Empathetic',
    description: "Use understanding, supportive language"
  },
  persuasive: {
    icon: '🎯',
    name: 'Persuasive',
    description: "Use compelling, action-oriented language"
  }
};

export async function transformNotes(notes: string, template: string, tone: string) {
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }

  try {
    const selectedTemplate = templatePrompts[template as keyof typeof templatePrompts];
    const selectedTone = toneModifiers[tone as keyof typeof toneModifiers];

    if (!selectedTemplate || !selectedTone) {
      throw new Error('Invalid template or tone selected');
    }

    const prompt = `Transform the following notes using these guidelines:
- ${selectedTemplate.prompt}
- ${selectedTone.description}
- Maintain the original meaning and key points
- Use clear, direct language
- Avoid unnecessary formatting or symbols
- Focus on content organization and clarity

Notes:
${notes}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional content editor focused on clear, direct communication. Transform the content while maintaining its essence, avoiding unnecessary formatting or symbols."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0.2,
      frequency_penalty: 0.3,
    });

    const transformedContent = completion.choices[0]?.message?.content;
    if (!transformedContent) {
      throw new Error('No content generated');
    }

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Save the project
    const { data: project, error: saveError } = await supabase
      .from('projects')
      .insert([{
        user_id: user.id,
        name: `${selectedTemplate.name} Notes`,
        content: transformedContent,
        template,
        tone,
        type: selectedTemplate.name,
      }])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving project:', saveError);
      // Return the transformed content even if saving fails
      return transformedContent;
    }

    return transformedContent;
  } catch (error) {
    console.error('Error transforming notes:', error);
    throw new Error('Failed to transform notes. Please try again.');
  }
}

export const templates = Object.entries(templatePrompts).map(([id, template]) => ({
  id,
  name: template.name,
  icon: template.icon
}));

export const tones = Object.entries(toneModifiers).map(([id, tone]) => ({
  id,
  name: tone.name,
  icon: tone.icon,
  description: tone.description
}));