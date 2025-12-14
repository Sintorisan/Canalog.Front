import { useTheme } from "../context/ThemeContext";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { useThemesQuery } from "../hooks/useThemesQuery";
import { useUpdateThemeMutation } from "../hooks/useUpdateThemeMutation";
import { useUserOptionsQuery } from "../hooks/useUserOptionsQuery";
import { ThemeSelector } from "../components/options/ThemeSelector";
import styles from "./OptionsPage.module.css";

export const OptionsPage = () => {
    const theme = useTheme();
    const { user, logout } = useAuthenticatedUser();
    const { data: themes, isLoading: themesLoading, error: themesError } = useThemesQuery();
    const { data: userOptions } = useUserOptionsQuery();
    const updateThemeMutation = useUpdateThemeMutation();

    // Find current theme ID by matching theme name
    const currentThemeId =
        userOptions?.theme && themes
            ? themes.find((t) => t.name === userOptions.theme.name)?.id ?? null
            : null;

    const handleThemeSelect = async (themeId: string) => {
        try {
            await updateThemeMutation.mutateAsync(themeId);
        } catch (error) {
            console.error("Failed to update theme:", error);
        }
    };

    return (
        <div className={styles.pageWrapper} style={{ backgroundImage: `url(${theme.background})` }}>
            <div className={styles.glassPanel}>
                <h1 className={styles.title}>Options</h1>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>User</h2>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.name || "User"}</p>
                        <p className={styles.userEmail}>{user?.email || ""}</p>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Theme</h2>
                    {themesLoading ? (
                        <p className={styles.placeholder}>Loading themes...</p>
                    ) : themesError ? (
                        <p className={styles.error}>Failed to load themes. Please try again.</p>
                    ) : themes && themes.length > 0 ? (
                        <ThemeSelector
                            themes={themes}
                            selectedThemeId={currentThemeId}
                            onSelect={handleThemeSelect}
                            isUpdating={updateThemeMutation.isPending}
                        />
                    ) : (
                        <p className={styles.placeholder}>No themes available.</p>
                    )}
                    {updateThemeMutation.isError && (
                        <p className={styles.error}>Failed to update theme. Please try again.</p>
                    )}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account</h2>
                    <button
                        className={styles.logoutButton}
                        onClick={() =>
                            logout({
                                logoutParams: { returnTo: window.location.origin },
                            })
                        }
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
