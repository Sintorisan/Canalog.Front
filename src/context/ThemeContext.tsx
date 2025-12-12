import { createContext, useContext } from "react";
import type { Theme } from "../types/OptionsTypes";

// A safe default theme. Used only before real theme loads.
export const defaultTheme: Theme = {
    name: "default",
    background: "#ffffff",
    colorScheme: {
        red: "#ff6b6b",
        blue: "#4d9fff",
        green: "#6ee7b7",
        yellow: "#ffe066",
        purple: "#c084fc",
    },
    uiColorScheme: {
        backgroundColor: "#fafafa",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        clockHandPrimary: "#0f172a",
        clockHandSecondary: "#38bdf8",
        tickPrimary: "#475569",
        tickSecondary: "#cbd5e1",
        glassHighlight: "#ffffff",
        glassShadow: "#e2e8f0",
        centerFill: "#ffffff",
        centerStroke: "#94a3b8",
        accent: "#6366f1",
    },
};

export const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);
