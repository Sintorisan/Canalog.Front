import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
    const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuthenticatedUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate({ to: "/" });
        }
    }, [isLoading, isAuthenticated, navigate]);

    if (isLoading) return <div className={styles.loading}>Loading…</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.left}>
                    <h1 className={styles.title}>DayClock</h1>
                    <p className={styles.subtitle}>
                        A modern calendar app with a daily timeline view
                    </p>
                    <p className={styles.description}>
                        See your day at a glance, schedule with confidence, and move through days
                        effortlessly.
                    </p>

                    <button
                        className={styles.cta}
                        onClick={() => loginWithRedirect()}
                        aria-label="Sign in"
                    >
                        Sign In
                    </button>

                    <small className={styles.note}>
                        Sign in to sync your events across devices.
                    </small>
                </div>

                <div className={styles.right} aria-hidden>
                    {/* Simple clock illustration */}
                    <svg
                        className={styles.clockSvg}
                        viewBox="0 0 120 120"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#6b21a8" />
                                <stop offset="100%" stopColor="#0ea5e9" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="#0f0b1a"
                            stroke="#2b0f3a"
                            strokeWidth="3"
                        />
                        <circle cx="60" cy="60" r="44" fill="url(#g)" opacity="0.08" />
                        <circle cx="60" cy="60" r="6" fill="#fff" />
                        <line
                            x1="60"
                            y1="60"
                            x2="60"
                            y2="25"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <line
                            x1="60"
                            y1="60"
                            x2="86"
                            y2="70"
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};
