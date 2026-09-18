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
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
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
        canvas: "#FAF9F6",
        ink: "#0B0D0E",
        amber: "#FFC86B",
        "amber-soft": "#FFF1D6",
        "amber-deep": "#806020",
        slate: "#52606D",
        "slate-muted": "#73808A",
        line: "#D9DDE0",
        success: "#688B55",
        "success-soft": "#EAF5E5",
        danger: "#9B3D2F",
        "dark-surface": "#182024",
        "note-foreground": "#D5DEE2",
        primary: {
          500: "#FFC86B",
          600: "#FFB84D",
          700: "#E8A33B",
        },
        gray: {
          500: "#BDBDBD",
        },
      },
    },
  },
  plugins: [require("@gluestack-ui/nativewind-utils/tailwind-plugin")],
};
