module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./app/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        catppuccin: {
          base: '#1e1e2e',
          mantle: '#181825',
          crust: '#11111b',
          surface0: '#313244',
          surface1: '#45475a',
          surface2: '#585b70',
          overlay0: '#6c7086',
          overlay1: '#7f849c',
          text: '#cdd6f4',
          subtext1: '#bac2de',
          subtext0: '#a6adc8',
          mauve: '#cba6f7',
          sky: '#89dceb',
          peach: '#fab387',
          green: '#a6e3a1'
        }
      }
    }
  },
  plugins: []
}
