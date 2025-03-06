export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: Template[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export const industries: Industry[] = [
  {
    id: 'education',
    name: 'Education',
    description: 'Transform your academic notes into polished content',
    icon: 'BookOpen',
    templates: [
      {
        id: 'academic_paper',
        name: 'Academic Paper',
        description: 'Turn your research notes into a well-structured academic paper',
        preview: 'From scattered study notes to a scholarly masterpiece!'
      },
      {
        id: 'study_guide',
        name: 'Study Guide',
        description: 'Create comprehensive study materials from your class notes',
        preview: 'Transform lecture scribbles into an organized study guide!'
      },
      {
        id: 'lesson_plan',
        name: 'Lesson Plan',
        description: 'Convert your teaching ideas into structured lesson plans',
        preview: 'Turn teaching concepts into engaging lessons!'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Create professional business documents',
    icon: 'Briefcase',
    templates: [
      {
        id: 'business_report',
        name: 'Business Report',
        description: 'Transform meeting notes into professional business reports',
        preview: 'From meeting minutes to executive summaries!'
      },
      {
        id: 'proposal',
        name: 'Business Proposal',
        description: 'Convert your ideas into compelling business proposals',
        preview: 'Turn concepts into winning proposals!'
      },
      {
        id: 'presentation',
        name: 'Business Presentation',
        description: 'Create engaging presentations from your notes',
        preview: 'Transform bullet points into powerful slides!'
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Create technical documentation and content',
    icon: 'Code',
    templates: [
      {
        id: 'technical_doc',
        name: 'Technical Documentation',
        description: 'Convert technical notes into clear documentation',
        preview: 'From code comments to comprehensive docs!'
      },
      {
        id: 'api_guide',
        name: 'API Guide',
        description: 'Transform API notes into user-friendly guides',
        preview: 'Turn API specs into clear documentation!'
      },
      {
        id: 'tech_blog',
        name: 'Tech Blog Post',
        description: 'Turn your tech insights into engaging blog posts',
        preview: 'From tech notes to viral blog posts!'
      }
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Transform your creative ideas into polished content',
    icon: 'Sparkles',
    templates: [
      {
        id: 'blog_post',
        name: 'Blog Post',
        description: 'Turn your ideas into engaging blog content',
        preview: 'From rough drafts to captivating posts!'
      },
      {
        id: 'story',
        name: 'Creative Story',
        description: 'Transform your story notes into flowing narratives',
        preview: 'Turn plot points into page-turners!'
      },
      {
        id: 'social_content',
        name: 'Social Media Content',
        description: 'Create engaging social media content from your notes',
        preview: 'From ideas to viral content!'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Create professional medical documentation',
    icon: 'Stethoscope',
    templates: [
      {
        id: 'medical_report',
        name: 'Medical Report',
        description: 'Transform clinical notes into detailed medical reports',
        preview: 'From patient notes to professional reports!'
      },
      {
        id: 'care_plan',
        name: 'Care Plan',
        description: 'Convert patient information into structured care plans',
        preview: 'Turn observations into actionable care plans!'
      },
      {
        id: 'health_article',
        name: 'Health Article',
        description: 'Create informative health articles from your research',
        preview: 'Transform medical knowledge into accessible content!'
      }
    ]
  }
];
