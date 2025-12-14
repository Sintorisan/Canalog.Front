import { ThemeListItem } from "../../services/apiService";
import styles from "./ThemeSelector.module.css";

interface ThemeSelectorProps {
    themes: ThemeListItem[];
    selectedThemeId: string | null;
    onSelect: (themeId: string) => void;
    isUpdating: boolean;
}

export const ThemeSelector = ({
    themes,
    selectedThemeId,
    onSelect,
    isUpdating,
}: ThemeSelectorProps) => {
    const handleThemeClick = (themeId: string) => {
        if (!isUpdating && themeId !== selectedThemeId) {
            onSelect(themeId);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.scrollContainer}>
                {themes.map((theme) => {
                    const isSelected = theme.id === selectedThemeId;
                    const imagePath = theme.background.startsWith("/")
                        ? theme.background
                        : `/${theme.background}`;

                    return (
                        <div
                            key={theme.id}
                            className={`${styles.themeCard} ${isSelected ? styles.selected : ""} ${
                                isUpdating ? styles.disabled : ""
                            }`}
                            onClick={() => handleThemeClick(theme.id)}
                        >
                            <div
                                className={styles.cardBackground}
                                style={{ backgroundImage: `url(${imagePath})` }}
                            />
                            <div className={styles.cardOverlay}>
                                <span className={styles.themeName}>{theme.name}</span>
                                {isSelected && (
                                    <div className={styles.checkmark}>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M20 6L9 17L4 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {isUpdating && (
                <div className={styles.loadingOverlay}>
                    <span>Updating theme...</span>
                </div>
            )}
        </div>
    );
};
