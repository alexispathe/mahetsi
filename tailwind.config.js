// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeInSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeOutSlideOut: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        // Nuevas animaciones para el modal de zoom
        fadeInZoom: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOutZoom: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        slideIn: 'slideIn 1500ms forwards',
        slideOut: 'slideOut 1500ms forwards',
        fadeIn: 'fadeIn 0.5s forwards',
        fadeOut: 'fadeOut 0.5s forwards',
        fadeInSlideIn: 'fadeInSlideIn 1s forwards',
        fadeOutSlideOut: 'fadeOutSlideOut 1s forwards',
        // Nuevas animaciones para el modal de zoom
        fadeInZoom: 'fadeInZoom 1s forwards', // Actualizado a 1s
        fadeOutZoom: 'fadeOutZoom 1s forwards', // Actualizado a 1s
      },
    },
  },
  plugins: [],
};
