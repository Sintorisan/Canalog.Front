// src/components/linear/DayLinear.tsx

import { useEffect, useMemo, useState } from "react";
import styles from "./DayLinear.module.css";
import type { DayEvents, CalendarEvent } from "../../types/EventTypes";
import { useTheme } from "../../context/ThemeContext";
import { getEventColorHex } from "../../utils/themeUtils";
import { minutesFromMidnight } from "../../utils/clockMathUtils";
import { useUpdateEventMutation } from "../../hooks/useUpdateEventMutation";
import { useDeleteEventMutation } from "../../hooks/useDeleteEventMutation";

const HALF_DAY_MINUTES = 12 * 60;

type TrackSegment = {
    id: string;
    event: CalendarEvent;
    startMinutesInTrack: number; // 0..720
    endMinutesInTrack: number; // 0..720
};

const projectToTrack = (
    e: CalendarEvent,
    trackStartMinutes: number,
    trackEndMinutes: number
): TrackSegment | null => {
    const start = minutesFromMidnight(e.start);
    const end = minutesFromMidnight(e.end);

    const segStartAbs = Math.max(start, trackStartMinutes);
    const segEndAbs = Math.min(end, trackEndMinutes);

    if (segEndAbs <= segStartAbs) return null;

    return {
        id: `${e.id}-${trackStartMinutes}`,
        event: e,
        startMinutesInTrack: segStartAbs - trackStartMinutes,
        endMinutesInTrack: segEndAbs - trackStartMinutes,
    };
};

export const DayLinear = ({ day }: { day: DayEvents }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const updateMut = useUpdateEventMutation();
    const deleteMut = useDeleteEventMutation();
    const theme = useTheme();

    // reset selection when date changes
    useEffect(() => {
        setSelectedId(null);
    }, [day.date.getTime()]);

    const morningSegments = useMemo(() => {
        return day.events
            .map((e) => projectToTrack(e as CalendarEvent, 0, HALF_DAY_MINUTES))
            .filter((x): x is TrackSegment => x !== null);
    }, [day.events]);

    const afternoonSegments = useMemo(() => {
        return day.events
            .map((e) => projectToTrack(e as CalendarEvent, HALF_DAY_MINUTES, HALF_DAY_MINUTES * 2))
            .filter((x): x is TrackSegment => x !== null);
    }, [day.events]);

    const selectedEvent = day.events.find((e) => e.id === selectedId);

    const handleBarClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, eventId: string) => {
        evt.stopPropagation();
        setSelectedId(eventId);
    };

    const renderTrack = (
        segments: TrackSegment[],
        hourOffset: number // 0 for 00–11, 12 for 12–23
    ) => {
        return (
            <div className={styles.track}>
                {/* axis line */}
                <div className={styles.axis} />

                {/* hour ticks and labels */}
                {[...Array(12)].map((_, i) => {
                    const minutesInTrack = (HALF_DAY_MINUTES / 11) * i;
                    const leftPercent = (minutesInTrack / HALF_DAY_MINUTES) * 100;
                    const hour = (hourOffset + i) % 24;

                    return (
                        <div
                            key={i}
                            className={styles.hourTick}
                            style={{ left: `${leftPercent}%` }}
                        >
                            <div className={styles.tickLine} />
                            <div className={styles.hourLabel}>{String(hour).padStart(2, "0")}</div>
                        </div>
                    );
                })}

                {/* event bars */}
                {segments.map((seg) => {
                    const length = seg.endMinutesInTrack - seg.startMinutesInTrack;
                    const left = (seg.startMinutesInTrack / HALF_DAY_MINUTES) * 100;
                    const width = (length / HALF_DAY_MINUTES) * 100;

                    const color = getEventColorHex(seg.event.color, theme.colorScheme);

                    const isSelected = selectedId === seg.event.id;

                    return (
                        <div
                            key={seg.id}
                            className={styles.eventBar}
                            style={{
                                left: `${left}%`,
                                width: `${width}%`,
                                background: color,
                                boxShadow: isSelected
                                    ? `0 0 18px ${color}`
                                    : `0 0 10px rgba(0,0,0,0.4)`,
                                opacity: selectedId && !isSelected ? 0.55 : 1,
                            }}
                            onClick={(evt) => handleBarClick(evt, seg.event.id)}
                        >
                            <span className={styles.eventLabel}>{seg.event.title}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const dayLabel = useMemo(
        () =>
            day.date.toLocaleDateString("sv-SE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
            }),
        [day.date]
    );

    return (
        <div
            className={styles.wrapper}
            onClick={() => setSelectedId(null)}
            style={{ backgroundImage: `url(${theme?.background})` }}
        >
            <div className={styles.glassPanel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dayHeader}>
                    <span className={styles.dayName}>{dayLabel}</span>
                </div>

                <div className={styles.tracksContainer}>
                    {/* 00–11 */}
                    {renderTrack(morningSegments, 0)}
                    {/* 12–23 */}
                    {renderTrack(afternoonSegments, 12)}
                </div>

                <div
                    className={styles.eventCard}
                    style={{ color: theme.uiColorScheme.textPrimary }}
                >
                    {selectedId && selectedEvent ? (
                        <>
                            <div className={styles.eventTitle}>{selectedEvent.title}</div>
                            <div className={styles.eventMeta}>
                                {new Date(selectedEvent.start).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(selectedEvent.end).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                            <div className={styles.eventButtons}>
                                <button
                                    className={styles.btn}
                                    onClick={() => {
                                        const newTitle = window.prompt(
                                            "Edit title",
                                            selectedEvent.title
                                        );
                                        if (newTitle === null || newTitle === selectedEvent.title) {
                                            return;
                                        }
                                        updateMut.mutate({
                                            ...(selectedEvent as CalendarEvent),
                                            title: newTitle,
                                        });
                                    }}
                                    disabled={updateMut.status === "pending"}
                                >
                                    Update
                                </button>
                                <button
                                    className={styles.btn}
                                    onClick={() =>
                                        deleteMut.mutate(selectedEvent as CalendarEvent, {
                                            onSuccess: () => {
                                                setSelectedId(null);
                                            },
                                        })
                                    }
                                    disabled={deleteMut.status === "pending"}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    ) : (
                        "Click an event bar to see details"
                    )}
                </div>
            </div>
        </div>
    );
};
