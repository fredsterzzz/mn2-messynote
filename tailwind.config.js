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
        'gradient-cta': 'linear-gradient(45deg, #8B5CF6, #F97316)',
        'gradient-cosmic': 'linear-gradient(135deg, #1a1040 0%, #0A0A0B 100%)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        reveal: 'reveal 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
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
            pre: {
              backgroundColor: '#111113',
            },
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}