// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: 'class',
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         purewhite: { DEFAULT: '#ffffff' },
//         darkbrown: { DEFAULT: '#4c3731' },
//         reddishbrown: { DEFAULT: '#6d310e' },
//         lightbeige: { DEFAULT: '#d0bfa9' },
//         grayishgreen: { DEFAULT: '#777d61' },
//       },
//     },
//   },
//   plugins: [],
// }











/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purewhite: { DEFAULT: '#ffffff' },
        darkbrown: { DEFAULT: '#4c3731' },
        reddishbrown: { DEFAULT: '#6d310e' },
        lightbeige: { DEFAULT: '#d0bfa9' },
        grayishgreen: { DEFAULT: '#777d61' },
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(2.5rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};