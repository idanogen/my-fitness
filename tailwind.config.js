/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F5F7FA',
        surface: '#FFFFFF',
        surfaceHover: '#F0F2F5',
        elevated: '#FFFFFF',
        primary: {
          50: '#FFF0ED',
          100: '#FFD6CC',
          200: '#FFAB99',
          300: '#FF8066',
          400: '#FF6B4A',
          500: '#E8553A',
          600: '#D14430',
        },
        secondary: {
          50: '#E6FAF5',
          100: '#B3F0E0',
          200: '#66E0C2',
          300: '#2ECDA3',
          400: '#0BB890',
          500: '#009B78',
        },
        tertiary: {
          50: '#F3EEFF',
          100: '#DDD0FF',
          200: '#B8A4FF',
          300: '#9B7FFF',
          400: '#7C5CFC',
        },
        txt: {
          primary: '#1A1D26',
          secondary: '#5A6178',
          tertiary: '#8E95A9',
        },
        border: {
          light: '#E8EBF0',
          medium: '#D1D5DE',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        heading: ['Rubik', 'sans-serif'],
        body: ['Assistant', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 2px hsl(220deg 60% 50% / 0.06), 0 2px 4px hsl(220deg 60% 50% / 0.06), 0 4px 8px hsl(220deg 60% 50% / 0.06)',
        'card-hover': '0 2px 4px hsl(220deg 60% 50% / 0.08), 0 4px 8px hsl(220deg 60% 50% / 0.08), 0 8px 16px hsl(220deg 60% 50% / 0.08)',
        'card-lg': '0 4px 8px hsl(220deg 60% 50% / 0.08), 0 8px 16px hsl(220deg 60% 50% / 0.08), 0 16px 32px hsl(220deg 60% 50% / 0.06)',
        'primary': '0 4px 12px hsl(14deg 100% 64% / 0.3)',
        'primary-hover': '0 6px 20px hsl(14deg 100% 64% / 0.4)',
        'teal': '0 4px 12px hsl(165deg 90% 38% / 0.25)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
    },
  },
  plugins: [],
};
