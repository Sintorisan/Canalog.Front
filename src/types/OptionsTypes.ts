export type EventColor = 0 | 1 | 2 | 3 | 4;

export type EventColorScheme = {
    red: string;
    blue: string;
    green: string;
    yellow: string;
    purple: string;
};

export type UiColorScheme = {
    backgroundColor: string;
    textPrimary: string;
    textSecondary: string;
    clockHandPrimary: string;
    clockHandSecondary: string;
    tickPrimary: string;
    tickSecondary: string;
    glassHighlight: string;
    glassShadow: string;
    centerFill: string;
    centerStroke: string;
    accent: string;
};

export type Theme = {
    name: string;
    background: string;
    colorScheme: EventColorScheme;
    uiColorScheme: UiColorScheme;
};
