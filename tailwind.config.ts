import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

          'hero': "url('/assets/images/collection-background.svg')",
          'card': "url('/assets/images/thumbnail-background.svg')",
      },
      colors: {
        lama: "#F35C7A",
        'primary': "green-300",
        "coral-red": "#FF6452",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)",
        // "main" : "#222831",
        // "main-text" : "#EEEEEE",
        // "main-secondary" : "#76ABAE"


        // Edit SVGS - collection-background, hamburger

        "main" : "#1B262C",
        "main-text" : "#BBE1FA",
        "main-secondary" : "#3282B8",
        "main-third" : "#0F4C75",
      },
    },
  },
  plugins: [],
};
export default config;