export const colors = {
  ink: "#0B0D0E",
  canvas: "#FAF9F6",
  white: "#FFFFFF",
  amber: "#FFC86B",
  amberSoft: "#FFF1D6",
  amberDeep: "#806020",
  slate: "#52606D",
  slateMuted: "#73808A",
  line: "#D9DDE0",
  darkSurface: "#182024",
  darkCard: "#243039",
  success: "#688B55",
  successSoft: "#EAF5E5",
  danger: "#9B3D2F",
} as const;

export const typography = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  mono: "Inter_600SemiBold",
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const spacing = {
  screen: 22,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const shadows = {
  soft: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 2,
  },
} as const;
