import { useState, useEffect, FormEvent } from "react";
import { useCreateEventMutation } from "../../hooks/useCreateEventMutation";
import { useTheme } from "../../context/ThemeContext";
import type { EventColor } from "../../types/EventTypes";
import styles from "./CreateEventModal.module.css";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
    const theme = useTheme();
    const createMutation = useCreateEventMutation();

    // Default to today, current hour to next hour
    const getDefaultStart = () => {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        return now;
    };

    const getDefaultEnd = () => {
        const start = getDefaultStart();
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return end;
    };

    const [title, setTitle] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [selectedColor, setSelectedColor] = useState<EventColor>(0);
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
            const defaultStart = getDefaultStart();
            const defaultEnd = getDefaultEnd();
            setTitle("");
            setStartDateTime(formatDateTimeLocal(defaultStart));
            setEndDateTime(formatDateTimeLocal(defaultEnd));
            setSelectedColor(0);
            setError(null);
        }
    }, [isOpen]);

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

        try {
            await createMutation.mutateAsync({
                title: title.trim(),
                start,
                end,
                color: selectedColor,
            });
            onClose();
        } catch (err) {
            setError("Failed to create event. Please try again.");
            console.error("Create error:", err);
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
                    <h2 className={styles.modalTitle}>Create Event</h2>
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
                            placeholder="Event title"
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
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


