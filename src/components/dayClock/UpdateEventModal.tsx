import { useState, useEffect, FormEvent } from "react";
import { useUpdateEventMutation } from "../../hooks/useUpdateEventMutation";
import { useTheme } from "../../context/ThemeContext";
import type { CalendarEvent, EventColor } from "../../types/EventTypes";
import styles from "./UpdateEventModal.module.css";

interface UpdateEventModalProps {
    event: CalendarEvent;
    isOpen: boolean;
    onClose: () => void;
}

export const UpdateEventModal = ({ event, isOpen, onClose }: UpdateEventModalProps) => {
    const theme = useTheme();
    const updateMutation = useUpdateEventMutation();
    const [title, setTitle] = useState(event.title);
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [selectedColor, setSelectedColor] = useState<EventColor>(event.color);
    const [error, setError] = useState<string | null>(null);

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateTimeLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        if (isOpen) {
            setTitle(event.title);
            setStartDateTime(formatDateTimeLocal(event.start));
            setEndDateTime(formatDateTimeLocal(event.end));
            setSelectedColor(event.color);
            setError(null);
        }
    }, [isOpen, event]);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            setError("Invalid date or time");
            return;
        }

        if (end <= start) {
            setError("End time must be after start time");
            return;
        }

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        const updatedEvent: CalendarEvent = {
            ...event,
            title: title.trim(),
            start,
            end,
            color: selectedColor,
        };

        try {
            await updateMutation.mutateAsync(updatedEvent);
            onClose();
        } catch (err) {
            setError("Failed to update event. Please try again.");
            console.error("Update error:", err);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const colorOptions: { value: EventColor; label: string; color: string }[] = [
        { value: 0, label: "Red", color: theme.colorScheme.red },
        { value: 1, label: "Blue", color: theme.colorScheme.blue },
        { value: 2, label: "Green", color: theme.colorScheme.green },
        { value: 3, label: "Yellow", color: theme.colorScheme.yellow },
        { value: 4, label: "Purple", color: theme.colorScheme.purple },
    ];

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
                    <h2 className={styles.modalTitle}>Update Event</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
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

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            required
                            autoFocus
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="start" className={styles.label}>
                                Start
                            </label>
                            <input
                                id="start"
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="end" className={styles.label}>
                                End
                            </label>
                            <input
                                id="end"
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Color</label>
                        <div className={styles.colorPicker}>
                            {colorOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`${styles.colorOption} ${
                                        selectedColor === option.value
                                            ? styles.colorOptionActive
                                            : ""
                                    }`}
                                    onClick={() => setSelectedColor(option.value)}
                                    style={{
                                        backgroundColor: option.color,
                                        borderColor:
                                            selectedColor === option.value
                                                ? theme.uiColorScheme.textPrimary
                                                : "transparent",
                                    }}
                                    aria-label={`Select ${option.label} color`}
                                >
                                    {selectedColor === option.value && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.3333 4L6 11.3333L2.66667 8"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={updateMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? "Updating..." : "Update Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


