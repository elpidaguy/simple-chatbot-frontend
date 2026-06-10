module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./app/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dracula: {
          background: '#282A36',
          currentLine: '#44475A',
          foreground: '#F8F8F2',
          comment: '#6272A4',
          cyan: '#8BE9FD',
          green: '#50FA7B',
          orange: '#FFB86C',
          pink: '#FF79C6',
          purple: '#BD93F9'
        }
      }
    }
  },
  plugins: []
}
