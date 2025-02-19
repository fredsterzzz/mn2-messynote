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

// Cache for storing recent transformations
const transformationCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Rate limiting
const userRequestsMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_HOUR = 50; // Increased from 20 to 50
const RATE_LIMIT_WINDOW = 1000 * 60 * 60; // 1 hour

// Token limits
const MAX_INPUT_TOKENS = 4000; // Increased from 2000 to 4000 (about 16,000 characters)
const MAX_OUTPUT_TOKENS = 2000; // Increased from 1500 to 2000
const AVERAGE_CHARS_PER_TOKEN = 4;

// Function to generate cache key
function generateCacheKey(notes: string, template: string, tone: string): string {
  return `${notes}-${template}-${tone}`;
}

// Function to clean old cache entries
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of transformationCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      transformationCache.delete(key);
    }
  }
}

// Function to check rate limit
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = userRequestsMap.get(userId);

  if (!userRequests || now > userRequests.resetTime) {
    userRequestsMap.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (userRequests.count >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }

  userRequests.count += 1;
  return true;
}

// Function to estimate token count
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / AVERAGE_CHARS_PER_TOKEN);
}

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

// Verify model access and get available models
async function getAvailableModel() {
  try {
    // Try GPT-3.5-turbo first
    await openai.chat.completions.create({
      messages: [{ role: "user", content: "test" }],
      model: "gpt-3.5-turbo-1106",
      max_tokens: 5
    });
    return "gpt-3.5-turbo-1106";
  } catch (error) {
    console.log("GPT-3.5-turbo not available, falling back to GPT-4");
    try {
      // Try GPT-4 as fallback
      await openai.chat.completions.create({
        messages: [{ role: "user", content: "test" }],
        model: "gpt-4",
        max_tokens: 5
      });
      return "gpt-4";
    } catch (error) {
      console.error("Neither GPT-3.5-turbo nor GPT-4 are available");
      throw new Error("No available AI models. Please check your OpenAI API key permissions.");
    }
  }
}

export async function transformNotes(notes: string, template: string, tone: string) {
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }

  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded. Please try again in an hour.');
    }

    // Check input token limit
    const estimatedTokens = estimateTokenCount(notes);
    if (estimatedTokens > MAX_INPUT_TOKENS) {
      throw new Error(`Input text is too long. Please reduce it by approximately ${Math.ceil((estimatedTokens - MAX_INPUT_TOKENS) * AVERAGE_CHARS_PER_TOKEN)} characters.`);
    }

    // Clean old cache entries
    cleanCache();

    // Check cache first
    const cacheKey = generateCacheKey(notes, template, tone);
    const cachedResult = transformationCache.get(cacheKey);
    if (cachedResult) {
      console.log('Using cached transformation');
      return cachedResult.content;
    }

    const selectedTemplate = templatePrompts[template as keyof typeof templatePrompts];
    const selectedTone = toneModifiers[tone as keyof typeof toneModifiers];

    if (!selectedTemplate || !selectedTone) {
      throw new Error('Invalid template or tone selected');
    }

    // Get available model
    const model = await getAvailableModel();
    console.log(`Using AI model: ${model}`);

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
      model,
      temperature: 0.5,
      max_tokens: MAX_OUTPUT_TOKENS,
      presence_penalty: 0,
      frequency_penalty: 0,
      response_format: { type: "text" }
    });

    const transformedContent = completion.choices[0]?.message?.content;
    if (!transformedContent) {
      throw new Error('No content generated');
    }

    // Cache the result
    transformationCache.set(cacheKey, {
      content: transformedContent,
      timestamp: Date.now()
    });

    // Save the project
    const { error: saveError } = await supabase
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