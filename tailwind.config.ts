import { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-space-mono)', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'grey-light': 'var(--grey-light)',
        'grey-dark': 'var(--grey-dark)',
        white: 'var(--white)',
        black: 'var(--black)',
        bg: 'var(--bg)',
        text: 'var(--text)',
        highlight: 'var(--highlight)',
      },
      fontSize: {
        'xl': '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
        '4xl': '2.4rem',
        '5xl': '2.8rem',
        '6xl': '4rem',
        'text-base': '1.25rem',
      },
      gridTemplateColumns: {
        '1-3': '33% auto',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
