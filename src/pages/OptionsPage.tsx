import { useTheme } from "../context/ThemeContext";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import styles from "./OptionsPage.module.css";

export const OptionsPage = () => {
    const theme = useTheme();
    const { user, logout } = useAuthenticatedUser();

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
                    <p className={styles.placeholder}>Theme settings coming soon...</p>
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


