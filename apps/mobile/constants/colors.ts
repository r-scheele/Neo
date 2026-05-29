export const colors = {
  primary: "#0E3B2E",
  primaryPressed: "#092A21",
  background: "#FBF7EF",
  surface: "#FFFDF8",
  surfaceAlt: "#F1E7D6",
  text: "#1F2522",
  textMuted: "#6F766F",
  border: "#E4D8C5",
  success: "#247A52",
  warning: "#B7791F",
  error: "#B9473A",
  info: "#2F6F8F",
  gold: "#C6A15B",
  terracotta: "#B86A4B",
} as const;

export type ColorToken = keyof typeof colors;
