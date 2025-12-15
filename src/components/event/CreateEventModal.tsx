import { useState, useEffect, type FormEvent } from "react";
import { useCreateEventMutation } from "../../hooks/useCreateEventMutation";
import { useTheme } from "../../context/ThemeContext";
import type { EventColor } from "../../types/OptionsTypes";
import styles from "./CreateEventModal.module.css";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Format date for date input (YYYY-MM-DD)
const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// Format time for time input (HH:mm) - 24-hour format
const formatTime = (date: Date): string => {
    const h = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${mm}`;
};

export const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
    const theme = useTheme();
    const createMutation = useCreateEventMutation();

    const defaultStart = () => {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        return now;
    };

    const defaultEnd = (start: Date) => {
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return end;
    };

    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedColor, setSelectedColor] = useState<EventColor>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const s = defaultStart();
            const e = defaultEnd(s);
            setTitle("");
            setStartDate(formatDate(s));
            setStartTime(formatTime(s));
            setEndDate(formatDate(e));
            setEndTime(formatTime(e));
            setSelectedColor(0);
            setError(null);
        }
    }, [isOpen]);

    // Update end date when start date changes
    useEffect(() => {
        if (startDate && endDate !== startDate) {
            setEndDate(startDate);
        }
    }, [startDate, endDate]);

    // Auto-adjust end time if it's before or equal to start time
    useEffect(() => {
        if (!isOpen || !startDate || !startTime || !endDate || !endTime) return;

        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (endDate === startDate && endMinutes <= startMinutes) {
            const newEndMinutes = startMinutes + 60; // Add 1 hour
            const newEndH = Math.floor(newEndMinutes / 60) % 24;
            const newEndM = newEndMinutes % 60;
            setEndTime(`${String(newEndH).padStart(2, "0")}:${String(newEndM).padStart(2, "0")}`);
        }
    }, [isOpen, startDate, startTime, endDate, endTime]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Parse date and time components
        const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        // Create Date objects in local time
        const start = new Date(startYear, startMonth - 1, startDay, startHours, startMinutes, 0, 0);
        const end = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes, 0, 0);

        if (!title.trim()) {
            setError("Please enter an event title");
            return;
        }

        if (end <= start) {
            setError("End time must be after start time");
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
        } catch {
            setError("Failed to create event. Please try again.");
        }
    };

    if (!isOpen) return null;

    const colorOptions: Array<{ value: EventColor; label: string; color: string }> = [
        { value: 0, label: "Red", color: theme.colorScheme.red },
        { value: 1, label: "Blue", color: theme.colorScheme.blue },
        { value: 2, label: "Green", color: theme.colorScheme.green },
        { value: 3, label: "Yellow", color: theme.colorScheme.yellow },
        { value: 4, label: "Purple", color: theme.colorScheme.purple },
    ];

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

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
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                        <h2 className={styles.modalTitle}>Create Event</h2>
                    </div>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
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

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            <span className={styles.labelText}>Event Title</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter event title"
                            autoFocus
                            required
                        />
                    </div>

                    <div className={styles.dateTimeSection}>
                        <div className={styles.sectionLabel}>Start</div>
                        <div className={styles.dateTimeRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="start-date" className={styles.sublabel}>
                                    Date <span className={styles.formatHint}>(dd-mm-yyyy)</span>
                                </label>
                                <input
                                    id="start-date"
                                    type="date"
                                    className={styles.input}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="start-time" className={styles.sublabel}>
                                    Time <span className={styles.formatHint}>(24h)</span>
                                </label>
                                <input
                                    id="start-time"
                                    type="time"
                                    className={styles.input}
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    step="60"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.dateTimeSection}>
                        <div className={styles.sectionLabel}>End</div>
                        <div className={styles.dateTimeRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="end-date" className={styles.sublabel}>
                                    Date <span className={styles.formatHint}>(dd-mm-yyyy)</span>
                                </label>
                                <input
                                    id="end-date"
                                    type="date"
                                    className={styles.input}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="end-time" className={styles.sublabel}>
                                    Time <span className={styles.formatHint}>(24h)</span>
                                </label>
                                <input
                                    id="end-time"
                                    type="time"
                                    className={styles.input}
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    step="60"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <span className={styles.labelText}>Color</span>
                        </label>
                        <div className={styles.colorPicker}>
                            {colorOptions.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    className={`${styles.colorOption} ${
                                        selectedColor === c.value ? styles.colorOptionActive : ""
                                    }`}
                                    onClick={() => setSelectedColor(c.value)}
                                    style={{ backgroundColor: c.color }}
                                    aria-label={`Select color ${c.value}`}
                                >
                                    {selectedColor === c.value && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M13.3333 4L6 11.3333L2.66667 8" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
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
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? (
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
                                    Creating...
                                </>
                            ) : (
                                "Create Event"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
