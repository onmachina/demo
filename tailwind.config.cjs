/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      textColor: {
        ui: {
          base: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          active: 'var(--color-text-active)',
          'icon-active': 'var(--color-icon-active)',
          icon: 'var(--color-icon)',
          arrows: 'var(--color-arrows)',
        },
      },
      backgroundColor: {
        ui: {
          base: 'var(--color-background)',
          active: 'var(--color-background-active)',
          selected: 'var(--color-background-selected)',
          hover: 'var(--color-background-hover)',
        },
      },
      borderColor: {
        ui: {
          base: 'var(--color-ui-lines)',
        },
      },
    },
  },
  plugins: [],
};
