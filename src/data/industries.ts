export interface Industry {
  id: string;
  name: string;
  templates: Template[];
  tones: Tone[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
}

export interface Tone {
  id: string;
  name: string;
  description: string;
}

export const industries: Industry[] = [
  {
    id: "tech",
    name: "Technology",
    templates: [
      {
        id: "tech-blog",
        name: "Technical Blog Post",
        description: "Detailed technical article with code examples and explanations"
      },
      {
        id: "product-release",
        name: "Product Release Notes",
        description: "Structured update about new features and improvements"
      },
      {
        id: "api-docs",
        name: "API Documentation",
        description: "Technical documentation with endpoints and usage examples"
      }
    ],
    tones: [
      {
        id: "technical",
        name: "Technical",
        description: "Precise and detailed technical language"
      },
      {
        id: "educational",
        name: "Educational",
        description: "Clear explanations suitable for learning"
      },
      {
        id: "innovative",
        name: "Innovative",
        description: "Forward-thinking and cutting-edge"
      }
    ]
  },
  {
    id: "marketing",
    name: "Marketing",
    templates: [
      {
        id: "campaign-brief",
        name: "Campaign Brief",
        description: "Marketing campaign overview with goals and metrics"
      },
      {
        id: "social-content",
        name: "Social Media Content",
        description: "Engaging posts for various social platforms"
      },
      {
        id: "email-sequence",
        name: "Email Sequence",
        description: "Series of connected marketing emails"
      }
    ],
    tones: [
      {
        id: "persuasive",
        name: "Persuasive",
        description: "Convincing and action-oriented"
      },
      {
        id: "friendly",
        name: "Friendly",
        description: "Warm and approachable"
      },
      {
        id: "professional",
        name: "Professional",
        description: "Business-appropriate and polished"
      }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    templates: [
      {
        id: "patient-edu",
        name: "Patient Education",
        description: "Clear health information for patients"
      },
      {
        id: "clinical-summary",
        name: "Clinical Summary",
        description: "Professional medical documentation"
      },
      {
        id: "health-blog",
        name: "Health Blog Post",
        description: "Evidence-based health articles"
      }
    ],
    tones: [
      {
        id: "empathetic",
        name: "Empathetic",
        description: "Caring and understanding"
      },
      {
        id: "authoritative",
        name: "Authoritative",
        description: "Expert and trustworthy"
      },
      {
        id: "clear",
        name: "Clear",
        description: "Simple and easy to understand"
      }
    ]
  },
  {
    id: "education",
    name: "Education",
    templates: [
      {
        id: "lesson-plan",
        name: "Lesson Plan",
        description: "Structured educational content"
      },
      {
        id: "study-guide",
        name: "Study Guide",
        description: "Learning materials with key points"
      },
      {
        id: "assessment",
        name: "Assessment",
        description: "Questions and evaluation materials"
      }
    ],
    tones: [
      {
        id: "instructional",
        name: "Instructional",
        description: "Teaching-focused and guiding"
      },
      {
        id: "encouraging",
        name: "Encouraging",
        description: "Supportive and motivating"
      },
      {
        id: "academic",
        name: "Academic",
        description: "Scholarly and research-based"
      }
    ]
  },
  {
    id: "finance",
    name: "Finance",
    templates: [
      {
        id: "market-analysis",
        name: "Market Analysis",
        description: "Detailed financial market review"
      },
      {
        id: "investment-report",
        name: "Investment Report",
        description: "Investment performance and recommendations"
      },
      {
        id: "financial-guide",
        name: "Financial Guide",
        description: "Educational content about financial topics"
      }
    ],
    tones: [
      {
        id: "analytical",
        name: "Analytical",
        description: "Data-driven and objective"
      },
      {
        id: "conservative",
        name: "Conservative",
        description: "Careful and risk-aware"
      },
      {
        id: "advisory",
        name: "Advisory",
        description: "Guidance-oriented and expert"
      }
    ]
  }
];
