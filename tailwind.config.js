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
      fontFamily: {
        poppins: [
          "Poppins_100Thin",
          "Poppins_200ExtraLight",
          "Poppins_300Light",
          "Poppins_400Regular",
          "Poppins_500Medium",
          "Poppins_600SemiBold",
          "Poppins_700Bold",
          "Poppins_800ExtraBold",
          "Poppins_900Black",
        ],
      },
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
