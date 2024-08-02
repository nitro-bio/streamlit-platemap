/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const brandColor = colors.sky;
const noirColor = colors.zinc;
export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@ninjha01/nitro-ui/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nitro-bio/nitro-ui-premium/dist/**/*.{js,ts,jsx,tsx}",
    "./src/data/initial_plate.json", // classNames in initial annotations
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        14: "repeat(14, minmax(0, 1fr))",
        26: "repeat(26, minmax(0, 1fr))",
      },

      colors: {
        noir: noirColor,
        brand: brandColor,
      },
    },
    ringColor: {
      brand: brandColor[500],
      noir: noirColor[500],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  daisyui: {
    logs: false,
    theme: false,
    themes: [
      {
        mytheme: {
          primary: brandColor["500"],
          secondary: "#463AA2",
          accent: "#C148AC",
          neutral: "#021431",
          "base-100": "#ffffff",
          info: "#93E7FB",
          success: "#81CFD1",
          warning: "#EFD7BB",
          error: "#E58B8B",
        },
      },
    ],
  },
};
