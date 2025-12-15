import { useState, useEffect, type FormEvent } from "react";
import { useUpdateEventMutation } from "../../hooks/useUpdateEventMutation";
import { useTheme } from "../../context/ThemeContext";
import type { CalendarEvent, EventColor } from "../../types/EventTypes";
import styles from "./UpdateEventModal.module.css";

interface UpdateEventModalProps {
    event: CalendarEvent;
    isOpen: boolean;
    onClose: () => void;
}

// Format for datetime-local input
const formatDateTimeLocal = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d}T${h}:${mm}`;
};

// Parse datetime-local input WITHOUT timezone drift
const parseLocalDateTime = (value: string): Date => {
    const [datePart, timePart] = value.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm] = timePart.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0);
};

export const UpdateEventModal = ({ event, isOpen, onClose }: UpdateEventModalProps) => {
    const theme = useTheme();
    const updateMutation = useUpdateEventMutation();

    const [title, setTitle] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [selectedColor, setSelectedColor] = useState<EventColor>(event.color);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(event.title);
            setStartDateTime(formatDateTimeLocal(event.start));
            setEndDateTime(formatDateTimeLocal(event.end));
            setSelectedColor(event.color);
            setError(null);
        }
    }, [isOpen, event]);

    // Auto-fix end time when start changes
    useEffect(() => {
        if (!isOpen) return;

        const start = parseLocalDateTime(startDateTime);
        const end = parseLocalDateTime(endDateTime);

        if (end <= start) {
            const newEnd = new Date(start);
            newEnd.setHours(start.getHours() + 1);
            setEndDateTime(formatDateTimeLocal(newEnd));
        }
    }, [startDateTime]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const start = parseLocalDateTime(startDateTime);
        const end = parseLocalDateTime(endDateTime);

        if (end <= start) {
            setError("End time must be after start time");
            return;
        }

        try {
            await updateMutation.mutateAsync({
                ...event,
                title: title.trim(),
                start,
                end,
                color: selectedColor,
            });

            onClose();
        } catch {
            setError("Failed to update event. Please try again.");
        }
    };

    if (!isOpen) return null;

    const colorOptions = [
        { value: 0, label: "Red", color: theme.colorScheme.red },
        { value: 1, label: "Blue", color: theme.colorScheme.blue },
        { value: 2, label: "Green", color: theme.colorScheme.green },
        { value: 3, label: "Yellow", color: theme.colorScheme.yellow },
        { value: 4, label: "Purple", color: theme.colorScheme.purple },
    ];

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
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
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Title</label>
                        <input
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Start</label>
                            <input
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>End</label>
                            <input
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Color</label>
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
                                />
                            ))}
                        </div>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Update Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
