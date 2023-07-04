import withMT from '@material-tailwind/react/utils/withMT';
import { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default withMT({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'grey-light': 'var(--grey-light)',
        'grey-dark': 'var(--grey-dark)',
        bg: 'var(--bg)',
        text: 'var(--text)',
        content: 'var(--content)',
        highlight: 'var(--highlight)',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
      fontSize: {
        '2xl': '1.25rem',
        '3xl': '2rem',
        '4xl': '2.4rem',
        '5xl': '2.8rem',
        '6xl': '4rem',
        'text-base': '1.5rem',
      },
      gridTemplateColumns: {
        '1-3': '33% auto',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config);
