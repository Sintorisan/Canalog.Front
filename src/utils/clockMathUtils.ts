// src/components/day/clockMath.ts
import type { CalendarEvent } from "../types/EventTypes";

export const HALF_MINUTES = 12 * 60;

export const minutesFromMidnight = (d: Date) => d.getHours() * 60 + d.getMinutes();

export const getRingRadius = (e: CalendarEvent, innerRadius: number, outerRadius: number) => {
    const start = minutesFromMidnight(e.start);
    return start < HALF_MINUTES ? innerRadius : outerRadius;
};

export const getDashProps = (e: CalendarEvent, r: number) => {
    const startMinutes = minutesFromMidnight(e.start);
    const endMinutes = minutesFromMidnight(e.end);
    const duration = Math.max(endMinutes - startMinutes, 1);

    const startWithinHalf =
        startMinutes < HALF_MINUTES ? startMinutes : startMinutes - HALF_MINUTES;

    const circ = 2 * Math.PI * r;

    const startFraction = startWithinHalf / HALF_MINUTES;
    const durationFraction = duration / HALF_MINUTES;

    const dashLength = durationFraction * circ;
    const dashOffset = -startFraction * circ;

    return {
        dashArray: `${dashLength} ${circ - dashLength}`,
        dashOffset,
    };
};

export const getHourHandPos = (now: Date, center: number, outerRadius: number) => {
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();

    const angle = ((hour + minute / 60) / 12) * Math.PI * 2 - Math.PI / 2;
    const length = outerRadius * 0.55;

    return {
        x: center + Math.cos(angle) * length,
        y: center + Math.sin(angle) * length,
    };
};

export const getMinuteHandPos = (now: Date, center: number, outerRadius: number) => {
    const minute = now.getMinutes();
    const angle = (minute / 60) * Math.PI * 2 - Math.PI / 2;
    const length = outerRadius * 0.85;

    return {
        x: center + Math.cos(angle) * length,
        y: center + Math.sin(angle) * length,
    };
};
