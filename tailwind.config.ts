import { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-bricolage)'],
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
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        'text-base': '1.25rem',
      },
      gridTemplateColumns: {
        '1-3': '33% auto',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
