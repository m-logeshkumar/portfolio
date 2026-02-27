/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#050507',
          900: '#0a0a0f',
          850: '#0d0d14',
          800: '#111119',
          700: '#16161f',
          600: '#1c1c28',
          500: '#252535',
        },
        navy: {
          950: '#0a1628',
          900: '#0f2247',
          800: '#1e3a6e',
          700: '#2d52a0',
        },
        accent: {
          cyan: '#06d6a0',
          blue: '#4cc9f0',
          purple: '#7b5ea7',
          pink: '#f72585',
          gold: '#ffd60a',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'linear-gradient(135deg, #0a0a0f 0%, #0f2247 25%, #0a0a0f 50%, #16161f 75%, #0a0a0f 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 214, 160, 0.3)',
        'glow-blue': '0 0 20px rgba(76, 201, 240, 0.3)',
        'glow-purple': '0 0 20px rgba(123, 94, 167, 0.3)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
