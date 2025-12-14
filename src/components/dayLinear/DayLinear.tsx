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
                {/* Timeline background */}
                <div className={styles.timelineBackground}>
                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => {
                        const minutesInTrack = (HALF_DAY_MINUTES / 11) * i;
                        const leftPercent = (minutesInTrack / HALF_DAY_MINUTES) * 100;
                        const hour = (hourOffset + i) % 24;

                        return (
                            <div
                                key={i}
                                className={styles.hourMarker}
                                style={{ left: `${leftPercent}%` }}
                            >
                                <div className={styles.markerLine} />
                                <div className={styles.hourLabel}>
                                    {String(hour).padStart(2, "0")}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Event blocks */}
                <div className={styles.eventsContainer}>
                    {segments.map((seg) => {
                        const length = seg.endMinutesInTrack - seg.startMinutesInTrack;
                        const left = (seg.startMinutesInTrack / HALF_DAY_MINUTES) * 100;
                        const width = (length / HALF_DAY_MINUTES) * 100;

                        const color = getEventColorHex(seg.event.color, theme.colorScheme);

                        const isSelected = selectedId === seg.event.id;
                        const startTime = new Date(seg.event.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        const endTime = new Date(seg.event.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        // Hide time for very small events
                        const isSmall = width < 8;
                        const isVerySmall = width < 4;

                        return (
                            <div
                                key={seg.id}
                                className={`${styles.eventBlock} ${
                                    isSelected ? styles.eventBlockSelected : ""
                                } ${isVerySmall ? styles.eventBlockTiny : ""} ${
                                    selectedId && !isSelected ? styles.eventBlockDimmed : ""
                                }`}
                                style={
                                    {
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        "--event-color": color,
                                    } as React.CSSProperties
                                }
                                onClick={(evt) => handleBarClick(evt, seg.event.id)}
                            >
                                {!isVerySmall && (
                                    <div className={styles.eventBlockContent}>
                                        <div className={styles.eventBlockTitle}>
                                            {seg.event.title}
                                        </div>
                                        {!isSmall && (
                                            <div className={styles.eventBlockTime}>
                                                {startTime} - {endTime}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
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
        <div className={styles.wrapper} onClick={() => setSelectedId(null)}>
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

                {selectedId && selectedEvent ? (
                    <div
                        className={styles.eventCard}
                        style={{ color: theme.uiColorScheme.textPrimary }}
                    >
                        <div className={styles.eventCardHeader}>
                            <div
                                className={styles.eventCardColorIndicator}
                                style={{
                                    backgroundColor: getEventColorHex(
                                        selectedEvent.color,
                                        theme.colorScheme
                                    ),
                                }}
                            />
                            <div className={styles.eventCardTitleSection}>
                                <h3 className={styles.eventTitle}>{selectedEvent.title}</h3>
                                <div className={styles.eventTimeRange}>
                                    <svg
                                        className={styles.timeIcon}
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>
                                        {new Date(selectedEvent.start).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}{" "}
                                        -{" "}
                                        {new Date(selectedEvent.end).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.eventCardActions}>
                            <button
                                className={styles.actionBtn}
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
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68607 11.9441 1.59231C12.1719 1.49854 12.4151 1.45166 12.6667 1.45166C12.9182 1.45166 13.1614 1.49854 13.3892 1.59231C13.617 1.68607 13.8249 1.82465 14 2.00001C14.1754 2.17537 14.314 2.38322 14.4077 2.61101C14.5015 2.8388 14.5484 3.08201 14.5484 3.33334C14.5484 3.58468 14.5015 3.82789 14.4077 4.05568C14.314 4.28347 14.1754 4.49132 14 4.66668L5.33333 13.3333L1.33333 14.6667L2.66667 10.6667L11.333 2.00001Z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                onClick={() =>
                                    deleteMut.mutate(selectedEvent as CalendarEvent, {
                                        onSuccess: () => {
                                            setSelectedId(null);
                                        },
                                    })
                                }
                                disabled={deleteMut.status === "pending"}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66667 1.33334H9.33333C9.68696 1.33334 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                ) : day.events.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg
                            className={styles.emptyIcon}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>No events scheduled</span>
                    </div>
                ) : (
                    <div className={styles.hintText}>Click an event to see details</div>
                )}
            </div>
        </div>
    );
};
