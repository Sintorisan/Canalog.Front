import { createContext, useContext } from "react";

export const mockTheme = {
    name: "Leafy",
    background: "src/mock/images/leafs.png", // path from your theme
    colorScheme: {
        red: "#ef476f",
        blue: "#118ab2",
        green: "#06d6a0",
        yellow: "#ffd166",
        purple: "#8338ec",
    },
    uiColorScheme: {
        backgroundColor: "#000000",
        textPrimary: "#ffffff",
        textSecondary: "#e5e7eb",
        clockHandPrimary: "#ffffff",
        clockHandSecondary: "#e5e7eb",
        tickPrimary: "#e5e7eb",
        tickSecondary: "#cbd5e1",
        glassHighlight: "#ffffff",
        glassShadow: "#94a3b8",
        centerFill: "#ffffff",
        centerStroke: "#94a3b8",
        accent: "#6366f1",
    },
};

export const ThemeContext = createContext(mockTheme);
export const useTheme = () => useContext(ThemeContext);
