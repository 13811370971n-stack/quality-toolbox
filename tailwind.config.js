/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Match ai-quality-portal McKinsey palette
        'mckinsey': {
          'navy': '#051C2C',
          'blue': '#0C2E4E',
          'steel': '#1E3A5F',
          'teal': '#00A0AF',
          'gold': '#C5A572',
          'light': '#F5F7FA',
          'muted': '#8B9DAF',
          'border': '#E2E8F0',
        },
        primary: {
          50: '#e6f7f8',
          100: '#cceff2',
          200: '#99dfe5',
          300: '#66cfd8',
          400: '#33bfcb',
          500: '#00A0AF',
          600: '#00808c',
          700: '#006069',
          800: '#004046',
          900: '#002023',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'display': ['Inter', 'SF Pro Display', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
