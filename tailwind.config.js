/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0B',
          secondary: '#111113',
        },
        accent: {
          purple: '#8B5CF6',
          orange: '#F97316',
          blue: '#3B82F6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E2E8F0', // Lightened from #94A3B8 for better contrast
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cta': 'linear-gradient(to right, #8B5CF6, #F97316)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#E2E8F0',
            h1: {
              color: '#FFFFFF',
            },
            h2: {
              color: '#FFFFFF',
            },
            h3: {
              color: '#FFFFFF',
            },
            strong: {
              color: '#FFFFFF',
            },
            a: {
              color: '#8B5CF6',
              '&:hover': {
                color: '#F97316',
              },
            },
            blockquote: {
              borderLeftColor: '#8B5CF6',
              color: '#E2E8F0',
            },
            code: {
              color: '#F97316',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#111113',
              color: '#E2E8F0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}