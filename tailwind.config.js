/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0B080F',
          900: '#100C14',
          850: '#140F1A',
          800: '#1B1024',
          700: '#261733',
          600: '#352147',
        },
        plum: {
          950: '#12091A',
          900: '#1B1024',
          800: '#281438',
          700: '#3A1B52',
          600: '#522375',
        },
        campus: {
          purple: '#8B2EFF',
          violet: '#B44CFF',
          magenta: '#FF38B8',
          orange: '#FF8A24',
          gold: '#FFC857',
          teal: '#22D3A6',
          lavender: '#B9ADC9',
          white: '#F8F5FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(180, 76, 255, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 25px rgba(255, 56, 184, 0.6))' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 46, 255, 0.4)',
        'glow-magenta': '0 0 25px -5px rgba(255, 56, 184, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 138, 36, 0.4)',
        'glow-teal': '0 0 25px -5px rgba(34, 211, 166, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
