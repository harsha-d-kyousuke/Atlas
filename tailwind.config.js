/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./{components,hooks,services,views}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'background': '#09090b',
        'foreground': '#fafafa',
        'card': '#18181b',
        'card-foreground': '#fafafa',
        'popover': '#18181b',
        'popover-foreground': '#fafafa',
        'primary': '#60a5fa',
        'primary-foreground': '#09090b',
        'secondary': '#3f3f46',
        'secondary-foreground': '#fafafa',
        'muted': '#27272a',
        'muted-foreground': '#a1a1aa',
        'accent': '#3b82f6',
        'accent-foreground': '#fafafa',
        'destructive': '#ef4444',
        'destructive-foreground': '#fafafa',
        'border': '#27272a',
        'input': '#27272a',
        'ring': '#60a5fa',
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: `calc(0.5rem - 4px)`,
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '75%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        popIn: 'popIn 0.6s ease-out forwards',
        fadeOut: 'fadeOut 0.5s ease-out forwards',
      },
    }
  },
  plugins: [],
}