import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeCssVars = () => {
    const theme = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        const ui = theme.uiColorScheme;

        root.style.setProperty("--ui-bg", ui.backgroundColor);
        root.style.setProperty("--ui-text-primary", ui.textPrimary);
        root.style.setProperty("--ui-text-secondary", ui.textSecondary);
        root.style.setProperty("--ui-accent", ui.accent);
        root.style.setProperty("--ui-glass-highlight", ui.glassHighlight);
        root.style.setProperty("--ui-glass-shadow", ui.glassShadow);
        root.style.setProperty("--ui-center-fill", ui.centerFill);
        root.style.setProperty("--ui-center-stroke", ui.centerStroke);
        root.style.setProperty("--ui-tick-primary", ui.tickPrimary);
        root.style.setProperty("--ui-tick-secondary", ui.tickSecondary);
        root.style.setProperty("--ui-clock-hand-primary", ui.clockHandPrimary);
        root.style.setProperty("--ui-clock-hand-secondary", ui.clockHandSecondary);
    }, [theme]);

    return null;
};
