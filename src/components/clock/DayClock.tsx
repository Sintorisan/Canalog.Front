import { useMemo, useState } from "react";
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

export const DayClock = ({ day }: { day: DayEvents }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const size = 360;
    const center = size / 2;

    // NEW RADII (your new geometry)
    const outerEventRadius = 120; // events 12–23
    const outerNumberRadius = 120; // numbers 12–23
    const innerNumberRadius = 95; // numbers 00–11
    const innerEventRadius = 95; // events 00–11

    const now = useMemo(() => new Date(), []);
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
        <div className={styles.wrapper} style={{ backgroundImage: `url(${theme?.background})` }}>
            <div className={styles.glassDial}>
                <div
                    className={styles.donut}
                    style={{
                        width: `${outerDiameter}px`,
                        height: `${outerDiameter}px`,
                        background: `rgba(255,255,255,0.32)`,
                        border: `1.25px solid ${theme.uiColorScheme.glassShadow}`,
                        backdropFilter: "blur(22px)",
                        WebkitBackdropFilter: "blur(22px)",
                        boxShadow: "0px 14px 40px rgba(0,0,0,0.14)",
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
                                opacity={selectedId && selectedId !== e.id ? 0.3 : 1}
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
                                opacity={selectedId && selectedId !== e.id ? 0.3 : 1}
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
                        EVENT CARD (unchanged)
                    =========================== */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.25)",
                        padding: "0.8rem 1.3rem",
                        borderRadius: "1rem",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.45)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        color: theme.uiColorScheme.textPrimary,
                    }}
                >
                    {selectedId
                        ? `${selectedEvent?.title} - ${selectedEvent?.start} - ${selectedEvent?.end}`
                        : "Click an event arc to see details"}
                </div>
            </div>
        </div>
    );
};
