/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Every colour is a CSS variable so light/dark swap with one attribute on <html>.
      colors: {
        paper: v('paper'),
        surface: v('surface'),
        raised: v('raised'),
        ink: v('ink'),
        oninv: v('oninv'),        // text that sits on an `ink` fill
        muted: v('muted'),
        line: v('line'),
        stage: v('stage'),        // video stage — dark in both themes
        brand: '#4338CA',         // solid fills with white text, same in both themes
        indigo: { DEFAULT: v('indigo'), soft: v('indigo-soft') },
        marigold: { DEFAULT: v('marigold'), soft: v('marigold-soft') },
        leaf: v('leaf'),
        chili: v('chili'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Noto Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Noto Sans"', '"Noto Sans Bengali"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: {
        float: '0 24px 60px -28px rgb(var(--shadow) / .45)',
        soft: '0 1px 2px rgb(var(--shadow) / .06), 0 8px 24px -16px rgb(var(--shadow) / .25)',
      },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        pop: { from: { opacity: 0, transform: 'scale(.97)' }, to: { opacity: 1, transform: 'none' } },
        sweep: { from: { backgroundSize: '0% 100%' }, to: { backgroundSize: '100% 100%' } },
      },
      animation: { rise: 'rise .45s ease both', fade: 'fade .25s ease both', pop: 'pop .2s ease both', sweep: 'sweep .6s ease forwards' },
    },
  },
  plugins: [],
};
