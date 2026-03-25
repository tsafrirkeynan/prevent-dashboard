/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:          '#0F1923',
        card:        '#162433',
        sidebar:     '#111D2B',
        'viss-blue': '#1F5C99',
        'accent':    '#2E86C1',
        'safe':      '#27AE60',
        'warn':      '#F39C12',
        'alert':     '#C0392B',
        'tp':        '#E8F0F7',
        'ts':        '#8FAFC7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
