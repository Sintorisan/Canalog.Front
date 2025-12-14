import { useTheme } from "../../context/ThemeContext";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
    message?: string;
    fullPage?: boolean;
}

export const LoadingSpinner = ({
    message = "Loading...",
    fullPage = false,
}: LoadingSpinnerProps) => {
    const theme = useTheme();

    const content = (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
            </div>
            <p className={styles.loadingText}>{message}</p>
        </div>
    );

    if (fullPage) {
        return (
            <div
                className={styles.fullPageWrapper}
                style={{ backgroundImage: `url(${theme.background})` }}
            >
                {content}
            </div>
        );
    }

    return content;
};
