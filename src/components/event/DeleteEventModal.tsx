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
                    <h2 className={styles.modalTitle}>Delete Event</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                        disabled={deleteMutation.isPending}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 5L5 15M5 5L15 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalContent}>
                    <p className={styles.confirmationText}>
                        Are you sure you want to delete this event?
                    </p>
                    <div className={styles.eventDetails}>
                        <div className={styles.eventDetailRow}>
                            <span className={styles.eventDetailLabel}>Title:</span>
                            <span className={styles.eventDetailValue}>{event.title}</span>
                        </div>
                        <div className={styles.eventDetailRow}>
                            <span className={styles.eventDetailLabel}>Time:</span>
                            <span className={styles.eventDetailValue}>
                                {formatTime(event.start)} - {formatTime(event.end)}
                            </span>
                        </div>
                    </div>
                    {deleteMutation.isError && (
                        <div className={styles.error}>
                            Failed to delete event. Please try again.
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
                        {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
                    </button>
                </div>
            </div>
        </div>
    );
};


