/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F64C95",
        gray: {
          500: "#BDBDBD",
        },
      },
    },
  },
  plugins: [require("@gluestack-ui/nativewind-utils/tailwind-plugin")],
};
