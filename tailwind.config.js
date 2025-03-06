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
          DEFAULT: '#0A0A0F',
          secondary: '#12121A',
        },
        accent: {
          purple: '#9333EA',
          orange: '#EA580C',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cta': 'linear-gradient(45deg, #9333EA, #EA580C)',
        'gradient-cosmic': 'linear-gradient(135deg, #1a1040 0%, #0A0A0F 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(147, 51, 234, 0.1), rgba(234, 88, 12, 0.1))',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'scale': 'scale 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 2px 8px -1px rgba(147, 51, 234, 0.15)',
        'glow-md': '0 4px 16px -2px rgba(147, 51, 234, 0.25)',
        'glow-lg': '0 8px 24px -4px rgba(147, 51, 234, 0.35)',
      },
    },
  },
  plugins: [],
}