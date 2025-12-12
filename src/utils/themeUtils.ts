import type { EventColor, EventColorScheme } from "../types/OptionsTypes";

export const getEventColorHex = (color: EventColor, scheme: EventColorScheme) => {
    switch (color) {
        case 0:
            return scheme.red;
        case 1:
            return scheme.blue;
        case 2:
            return scheme.green;
        case 3:
            return scheme.yellow;
        case 4:
            return scheme.purple;
        default:
            return scheme.blue;
    }
};
