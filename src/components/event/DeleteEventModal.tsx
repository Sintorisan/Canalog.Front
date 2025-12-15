import { useEffect } from "react";
import { useDeleteEventMutation } from "../../hooks/useDeleteEventMutation";
import { useTheme } from "../../context/ThemeContext";
import type { CalendarEvent } from "../../types/EventTypes";
import { formatTime } from "../../utils/dateUtils";
import styles from "./DeleteEventModal.module.css";

interface DeleteEventModalProps {
    event: CalendarEvent;
    isOpen: boolean;
    onClose: () => void;
    onDeleted: () => void;
}

export const DeleteEventModal = ({ event, isOpen, onClose, onDeleted }: DeleteEventModalProps) => {
    const theme = useTheme();
    const deleteMutation = useDeleteEventMutation();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            onDeleted();
            onClose();
        }
    }, [deleteMutation.isSuccess, onDeleted, onClose]);

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(event);
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div
                className={styles.modal}
                style={{
                    color: theme.uiColorScheme.textPrimary,
                    borderColor: theme.uiColorScheme.glassShadow,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.iconWrapper}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        <h2 className={styles.modalTitle}>Delete Event</h2>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                        disabled={deleteMutation.isPending}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M15 5L5 15M5 5L15 15" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalContent}>
                    <p className={styles.confirmationText}>
                        Are you sure you want to delete this event? This action cannot be undone.
                    </p>
                    <div className={styles.eventDetails}>
                        <div className={styles.eventDetailRow}>
                            <span className={styles.eventDetailLabel}>Title</span>
                            <span className={styles.eventDetailValue}>{event.title}</span>
                        </div>
                        <div className={styles.eventDetailRow}>
                            <span className={styles.eventDetailLabel}>Time</span>
                            <span className={styles.eventDetailValue}>
                                {formatTime(event.start)} - {formatTime(event.end)}
                            </span>
                        </div>
                    </div>
                    {deleteMutation.isError && (
                        <div className={styles.error} role="alert">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="8" cy="8" r="6" />
                                <line x1="8" y1="5" x2="8" y2="8" />
                                <line x1="8" y1="11" x2="8.01" y2="11" />
                            </svg>
                            <span>Failed to delete event. Please try again.</span>
                        </div>
                    )}
                </div>

                <div className={styles.modalActions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <svg
                                    className={styles.spinner}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                >
                                    <circle
                                        cx="8"
                                        cy="8"
                                        r="7"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray="43.98"
                                        strokeDashoffset="10.99"
                                    />
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Delete Event"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
