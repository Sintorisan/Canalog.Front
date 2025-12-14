import { useMemo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useWeekEventsQuery } from "../hooks/useWeekEventsQuery";
import { useDayEventsQuery } from "../hooks/useDayEventsQuery";
import { useTheme } from "../context/ThemeContext";
import { DayClock } from "../components/dayClock/DayClock";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";
import { addDays, getMonday, formatIsoDate, parseIsoDate } from "../utils/dateUtils";
import styles from "./DayEventsPage.module.css";

export const DayEventsPage = () => {
    const navigate = useNavigate();
    const { location } = useRouterState();
    const theme = useTheme();

    const pathSeg =
        location?.pathname && location.pathname !== "/" ? location.pathname.slice(1) : null;
    const ignoreSegments = ["login", "week", "options"];
    const normalizedSeg = pathSeg && !ignoreSegments.includes(pathSeg) ? pathSeg : null;
    const paramDate = normalizedSeg ? parseIsoDate(normalizedSeg) : null;

    // Normalize date to midnight to avoid timezone issues
    const date = (() => {
        const d = paramDate ?? new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    })();

    // Prefetch the whole week that contains `date` so day navigation within week is instant
    const weekStart = useMemo(() => {
        const monday = getMonday(date);
        monday.setHours(0, 0, 0, 0);
        return monday;
    }, [date]);

    const {
        data: weekData,
        isLoading: isWeekLoading,
        isError: isWeekError,
    } = useWeekEventsQuery(weekStart);

    // Check if the current date is in the week data
    const isoDate = formatIsoDate(date);
    const dayInWeek = weekData?.days.find((d) => formatIsoDate(d.date) === isoDate);

    // Only fetch day data if the day is not in the week data (fallback for days outside current week)
    const { data: dayData, isLoading: isDayLoading } = useDayEventsQuery(date, {
        enabled: !!weekData && !dayInWeek,
    });

    const goToDate = (d: Date) => {
        const normalized = new Date(d);
        normalized.setHours(0, 0, 0, 0);
        navigate({ to: `/${formatIsoDate(normalized)}` });
    };

    const goToToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        goToDate(today);
    };

    const goToPreviousDay = () => goToDate(addDays(date, -1));
    const goToNextDay = () => goToDate(addDays(date, 1));

    const isLoading = isWeekLoading || isDayLoading;
    const isError = isWeekError;

    if (isError) {
        return (
            <div
                className={styles.pageWrapper}
                style={{ backgroundImage: `url(${theme.background})` }}
            >
                <div className={styles.errorContainer}>
                    <svg
                        className={styles.errorIcon}
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h2 className={styles.errorTitle}>Error loading events</h2>
                    <p className={styles.errorMessage}>Please try again later</p>
                </div>
            </div>
        );
    }

    if (isLoading || !weekData) {
        return (
            <div
                className={styles.pageWrapper}
                style={{ backgroundImage: `url(${theme.background})` }}
            >
                <LoadingSpinner message="Loading events..." fullPage={false} />
            </div>
        );
    }

    const readableDate = date.toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Find the DayEvents object for the selected date inside the prefetched week
    // If not found, use the day query data as fallback
    const dayFromWeek = weekData.days.find((d) => {
        const dIso = formatIsoDate(d.date);
        return dIso === isoDate;
    });

    const day = dayFromWeek || (dayData ? { date, events: dayData.events } : { date, events: [] });

    return (
        <div className={styles.pageWrapper} style={{ backgroundImage: `url(${theme.background})` }}>
            <div className={styles.header} style={{ color: theme.uiColorScheme.textPrimary }}>
                <div className={styles.controls}>
                    <button className={styles.navButton} onClick={goToPreviousDay}>
                        ◀
                    </button>
                    <div className={styles.dateLabel}>{readableDate}</div>
                    <button className={styles.navButton} onClick={goToNextDay}>
                        ▶
                    </button>
                </div>
                <button className={styles.todayButton} onClick={goToToday}>
                    Today
                </button>
            </div>

            <div className={styles.clockWrap}>
                <DayClock day={day} />
            </div>
        </div>
    );
};
