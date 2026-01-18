/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Design System Colors - Automation Platform
      colors: {
        // Primary Violet
        primary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#ddd0ff',
          300: '#c4a8ff',
          400: '#a875ff',
          500: '#8b3dff',
          600: '#7c1fff',
          700: '#6a0dad', // Main primary color
          800: '#5c0b94',
          900: '#4c0a78',
          950: '#2e0452',
        },
        // Secondary Blue (tech, reliability)
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Accent Cyan (futuristic touch)
        accent: {
          cyan: '#06b6d4',
          'cyan-light': '#67e8f9',
          pink: '#f472b6',
          'pink-light': '#fbcfe8',
        },
        // Neutral Grays
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.7' }],
      },
      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Border Radius (rounded, modern SaaS style)
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Box Shadows (light, elegant)
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 20px -4px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'primary': '0 10px 40px -10px rgba(106, 13, 173, 0.35)',
        'primary-lg': '0 20px 50px -15px rgba(106, 13, 173, 0.4)',
        'glow': '0 0 40px rgba(106, 13, 173, 0.15)',
        'glow-strong': '0 0 60px rgba(106, 13, 173, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.08), 0 8px 30px rgba(0, 0, 0, 0.1)',
      },
      // Background Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6a0dad 0%, #4c0a78 100%)',
        'gradient-primary-soft': 'linear-gradient(135deg, #f5f0ff 0%, #ede5ff 100%)',
        'gradient-violet-blue': 'linear-gradient(135deg, #6a0dad 0%, #3b82f6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #6a0dad 0%, #8b3dff 50%, #3b82f6 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
        'gradient-surface': 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(106, 13, 173, 0.1) 0%, transparent 70%)',
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(106, 13, 173, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(106, 13, 173, 0.4)' },
        },
      },
      // Transitions
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
