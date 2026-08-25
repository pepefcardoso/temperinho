import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      plugins: [tailwindcssAnimate],
    },
  },
};

export default config;
