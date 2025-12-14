import { Link, useRouterState } from "@tanstack/react-router";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { CreateEventModal } from "../event/CreateEventModal";

export default function Navbar() {
    const { location } = useRouterState();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/") {
            return (
                location.pathname === "/" ||
                (location.pathname !== "/week" &&
                    location.pathname !== "/options" &&
                    !location.pathname.startsWith("/login"))
            );
        }
        return location.pathname === path || location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarContent}>
                    <Link
                        to="/"
                        className={`${styles.navButton} ${isActive("/") ? styles.active : ""}`}
                    >
                        <svg className={styles.navIcon} viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className={styles.navLabel}>Today</span>
                    </Link>

                    <Link
                        to="/week"
                        className={`${styles.navButton} ${isActive("/week") ? styles.active : ""}`}
                    >
                        <svg className={styles.navIcon} viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="7" y1="14" x2="7" y2="18" />
                            <line x1="12" y1="14" x2="12" y2="18" />
                            <line x1="17" y1="14" x2="17" y2="18" />
                        </svg>
                        <span className={styles.navLabel}>Week</span>
                    </Link>

                    <button
                        className={styles.navButton}
                        onClick={() => setIsCreateModalOpen(true)}
                        aria-label="Add Event"
                    >
                        <svg className={styles.navIcon} viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span className={styles.navLabel}>Add</span>
                    </button>

                    <Link
                        to="/options"
                        className={`${styles.navButton} ${
                            isActive("/options") ? styles.active : ""
                        }`}
                    >
                        <svg className={styles.navIcon} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                        </svg>
                        <span className={styles.navLabel}>Options</span>
                    </Link>
                </div>
            </nav>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
}
