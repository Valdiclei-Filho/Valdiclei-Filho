import type { ProfileTheme, ThemeName } from "./model.js";

const themes: Record<ThemeName, ProfileTheme> = {
  dark: {
    name: "dark",
    background: "#060b12",
    panel: "#09131d",
    panelSecondary: "#0c1822",
    grid: "#102536",
    border: "#15506b",
    cyan: "#00c8ff",
    green: "#39d353",
    orange: "#ff8a1f",
    text: "#e8f4f8",
    muted: "#8fb3c7",
    inactive: "#10202c",
    contribution: ["#10202c", "#0e4429", "#006d32", "#26a641", "#39d353"]
  },
  light: {
    name: "light",
    background: "#f5fbff",
    panel: "#ffffff",
    panelSecondary: "#eef7fb",
    grid: "#dcecf4",
    border: "#58a9c7",
    cyan: "#007fa8",
    green: "#168638",
    orange: "#c85e00",
    text: "#102b3a",
    muted: "#4c6f80",
    inactive: "#e4eef3",
    contribution: ["#e4eef3", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
  }
};

export function getTheme(name: ThemeName): ProfileTheme {
  return themes[name];
}
