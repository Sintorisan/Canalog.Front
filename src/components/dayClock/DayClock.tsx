import { useMemo, useState, useEffect } from "react";
import styles from "./DayClock.module.css";
import type { DayEvents, CalendarEvent } from "../../types/EventTypes";
import { useTheme } from "../../context/ThemeContext";
import { getEventColorHex } from "../../utils/themeUtils";
import {
    HALF_MINUTES,
    minutesFromMidnight,
    getDashProps,
    getHourHandPos,
    getMinuteHandPos,
} from "../../utils/clockMathUtils";
import { formatTime } from "../../utils/dateUtils";
import { UpdateEventModal } from "../event/UpdateEventModal";
import { DeleteEventModal } from "../event/DeleteEventModal";

export const DayClock = ({ day }: { day: DayEvents }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [now, setNow] = useState(() => new Date());

    const size = 360;
    const center = size / 2;

    // NEW RADII (your new geometry)
    const outerEventRadius = 120; // events 12–23
    const outerNumberRadius = 120; // numbers 12–23
    const innerNumberRadius = 95; // numbers 00–11
    const innerEventRadius = 95; // events 00–11

    // Update clock every second for smooth animation
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const theme = useTheme();
    const minutesToDate = (base: Date, mins: number) => {
        const d = new Date(base);
        d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
        return d;
    };

    // Hour hand
    const hourHand = useMemo(
        () => getHourHandPos(now, center, outerEventRadius),
        [now, center, outerEventRadius]
    );

    // Minute hand
    const minuteHand = useMemo(
        () => getMinuteHandPos(now, center, outerEventRadius),
        [now, center, outerEventRadius]
    );

    // We'll rely on the shared getDashProps from clockMathUtils

    const selectedEvent = day.events.find((e) => e.id === selectedId);

    const outerDiameter = (outerNumberRadius + 20) * 2;
    const overlayDiameter = (outerNumberRadius + 14) * 2;
    const holeRadius = 80; // keep existing mask hole size from SVG

    return (
        <div>
            <div className={styles.glassDial}>
                <div
                    className={styles.donut}
                    style={{
                        width: `${outerDiameter}px`,
                        height: `${outerDiameter}px`,
                        maskImage: `radial-gradient(circle at center, transparent ${holeRadius}px, black ${holeRadius}px)`,
                        WebkitMaskImage: `radial-gradient(circle at center, transparent ${holeRadius}px, black ${holeRadius}px)`,
                    }}
                />
                <div
                    className={styles.donutOverlay}
                    style={{
                        width: `${overlayDiameter}px`,
                        height: `${overlayDiameter}px`,
                        background: `rgba(255,255,255,0.06)`,
                    }}
                />
                <svg width={size} height={size} style={{ position: "relative", zIndex: 3 }}>
                    {/* ===========================
                            DEFINITIONS
                        =========================== */}
                    <defs>
                        <filter id="frostBlur" x="-50%" y="-50%" width="200%" height="200%">
                            <feFlood floodColor="#ffffff" floodOpacity="0.24" result="flood" />
                            <feBlend in="SourceGraphic" in2="flood" mode="normal" result="base" />
                            <feGaussianBlur in="base" stdDeviation="12" result="blur" />
                            <feComposite in="blur" in2="SourceAlpha" operator="in" result="glass" />
                            <feMerge>
                                <feMergeNode in="glass" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                            <feDropShadow
                                dx="0"
                                dy="14"
                                stdDeviation="18"
                                floodColor="#000"
                                floodOpacity="0.14"
                            />
                        </filter>

                        <filter id="glassGrain" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.8"
                                numOctaves="3"
                                result="noise"
                            />
                            <feColorMatrix type="saturate" values="0" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.12" />
                            </feComponentTransfer>
                            <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
                        </filter>

                        <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow
                                dx="0"
                                dy="1"
                                stdDeviation="2"
                                floodColor="#000"
                                floodOpacity="0.7"
                            />
                        </filter>

                        <mask id="glassMask">
                            <rect width="100%" height="100%" fill="white" />
                            <circle cx="50%" cy="50%" r="80" fill="black" />
                        </mask>
                    </defs>

                    {/* ===========================
                            EVENT RINGS (under numbers)
                        =========================== */}
                    {/* Outer events (12–23) */}
                    {day.events.map((e) => {
                        // construct clamped outer segment for this day
                        const startMinutes = minutesFromMidnight(e.start);
                        const endMinutes = minutesFromMidnight(e.end);
                        const segStart = Math.max(startMinutes, HALF_MINUTES);
                        const segEnd = Math.min(endMinutes, HALF_MINUTES * 2);
                        if (segEnd <= segStart) return null;

                        // create a Date-based segment event clamped to the same day
                        const dayStart = new Date(day.date);
                        dayStart.setHours(0, 0, 0, 0);
                        const start = minutesToDate(dayStart, segStart);
                        const end = minutesToDate(dayStart, segEnd);

                        const segEvent: CalendarEvent = { ...e, start, end } as CalendarEvent;
                        const r = outerEventRadius;
                        const { dashArray, dashOffset } = getDashProps(segEvent, r);
                        const color = getEventColorHex(e.color, theme.colorScheme);

                        return (
                            <circle
                                key={`outer-${e.id}`}
                                cx={center}
                                cy={center}
                                r={r}
                                transform={`rotate(-90 ${center} ${center})`}
                                stroke={color}
                                strokeWidth={20}
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                opacity={selectedId && selectedId !== e.id ? 0.5 : 1}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedId(e.id)}
                            />
                        );
                    })}

                    {/* Inner events (00–11) */}
                    {day.events.map((e) => {
                        const startMinutes = minutesFromMidnight(e.start);
                        const endMinutes = minutesFromMidnight(e.end);
                        const segStart = Math.max(startMinutes, 0);
                        const segEnd = Math.min(endMinutes, HALF_MINUTES);
                        if (segEnd <= segStart) return null;

                        const dayStart = new Date(day.date);
                        dayStart.setHours(0, 0, 0, 0);
                        const start = minutesToDate(dayStart, segStart);
                        const end = minutesToDate(dayStart, segEnd);

                        const segEvent: CalendarEvent = { ...e, start, end } as CalendarEvent;
                        const r = innerEventRadius;
                        const { dashArray, dashOffset } = getDashProps(segEvent, r);
                        const color = getEventColorHex(e.color, theme.colorScheme);

                        return (
                            <circle
                                key={`inner-${e.id}`}
                                cx={center}
                                cy={center}
                                r={r}
                                transform={`rotate(-90 ${center} ${center})`}
                                stroke={color}
                                strokeWidth={20}
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                opacity={selectedId && selectedId !== e.id ? 0.5 : 1}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedId(e.id)}
                            />
                        );
                    })}

                    {/* ===========================
                            NUMBERS (above events)
                        =========================== */}
                    {[...Array(12)].map((_, i) => {
                        const hour = i + 12;
                        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                        const x = center + Math.cos(angle) * outerNumberRadius;
                        const y = center + Math.sin(angle) * outerNumberRadius;

                        return (
                            <text
                                key={`outer-${hour}`}
                                x={x}
                                y={y}
                                fill={theme.uiColorScheme.textPrimary}
                                fontSize="11"
                                fontWeight="600"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ fontFamily: "system-ui" }}
                            >
                                {hour}
                            </text>
                        );
                    })}

                    {[...Array(12)].map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                        const x = center + Math.cos(angle) * innerNumberRadius;
                        const y = center + Math.sin(angle) * innerNumberRadius;

                        return (
                            <text
                                key={`inner-${i}`}
                                x={x}
                                y={y}
                                fill={theme.uiColorScheme.textPrimary}
                                fontSize="11"
                                fontWeight="500"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ fontFamily: "system-ui" }}
                            >
                                {String(i).padStart(2, "0")}
                            </text>
                        );
                    })}

                    {/* ===========================
                            HANDS
                        =========================== */}
                    <g filter="url(#handShadow)">
                        <line
                            x1={center}
                            y1={center}
                            x2={hourHand.x}
                            y2={hourHand.y}
                            stroke={theme.uiColorScheme.clockHandPrimary}
                            strokeWidth={5}
                            strokeLinecap="round"
                        />
                        <line
                            x1={center}
                            y1={center}
                            x2={minuteHand.x}
                            y2={minuteHand.y}
                            stroke={theme.uiColorScheme.clockHandSecondary}
                            strokeWidth={3}
                            strokeLinecap="round"
                        />
                    </g>

                    {/* Center cap */}
                    <circle
                        cx={center}
                        cy={center}
                        r={7}
                        fill={theme.uiColorScheme.centerFill}
                        stroke={theme.uiColorScheme.centerStroke}
                        strokeWidth={2}
                    />
                </svg>

                {/* ===========================
                        EVENT CARD
                    =========================== */}
                <div
                    className={styles.eventCard}
                    style={{ color: theme.uiColorScheme.textPrimary }}
                >
                    {selectedId && selectedEvent ? (
                        <div className={styles.eventCardContent}>
                            <div className={styles.eventInfo}>
                                <div className={styles.eventTitle}>{selectedEvent.title}</div>
                                <div className={styles.eventTime}>
                                    {formatTime(selectedEvent.start)} -{" "}
                                    {formatTime(selectedEvent.end)}
                                </div>
                            </div>
                            <div className={styles.eventActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    aria-label="Update event"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68607 11.9441 1.59231C12.1719 1.49854 12.4151 1.45166 12.6667 1.45166C12.9182 1.45166 13.1614 1.49854 13.3892 1.59231C13.617 1.68607 13.8249 1.82465 14 2.00001C14.1754 2.17537 14.314 2.38322 14.4077 2.61101C14.5015 2.8388 14.5484 3.08201 14.5484 3.33334C14.5484 3.58468 14.5015 3.82789 14.4077 4.05568C14.314 4.28347 14.1754 4.49132 14 4.66668L5.33333 13.3333L1.33333 14.6667L2.66667 10.6667L11.333 2.00001Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    aria-label="Delete event"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66667 1.33334H9.33333C9.68696 1.33334 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.eventCardPlaceholder}>
                            Click an event arc to see details
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {selectedEvent && (
                <>
                    <UpdateEventModal
                        event={selectedEvent}
                        isOpen={isUpdateModalOpen}
                        onClose={() => setIsUpdateModalOpen(false)}
                    />
                    <DeleteEventModal
                        event={selectedEvent}
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onDeleted={() => {
                            setSelectedId(null);
                            setIsDeleteModalOpen(false);
                        }}
                    />
                </>
            )}
        </div>
    );
};
