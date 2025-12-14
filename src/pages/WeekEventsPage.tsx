import { useState, useMemo } from "react";
import { useWeekEventsQuery } from "../hooks/useWeekEventsQuery";
import { addDays, getMonday, formatIsoDate } from "../utils/dateUtils";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "@tanstack/react-router";
import { getEventColorHex } from "../utils/themeUtils";
import { formatTime } from "../utils/dateUtils";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";
import styles from "./WeekEventsPage.module.css";

export const WeekEventsPage = () => {
    const [weekStart, setWeekStart] = useState(getMonday(new Date()));
    const theme = useTheme();
    const navigate = useNavigate();

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const next = () => setWeekStart((prev) => addDays(prev, 7));
    const prev = () => setWeekStart((prev) => addDays(prev, -7));
    const goToToday = () => setWeekStart(getMonday(new Date()));

    const { data, isLoading } = useWeekEventsQuery(weekStart);

    const isCurrentWeek = useMemo(() => {
        const currentWeekStart = getMonday(new Date());
        return formatIsoDate(weekStart) === formatIsoDate(currentWeekStart);
    }, [weekStart]);

    // Ensure we have 7 days (Monday to Sunday)
    const weekDays = useMemo(() => {
        if (!data?.days) return [];
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = addDays(weekStart, i);
            const dayData = data.days.find((d) => formatIsoDate(d.date) === formatIsoDate(date));
            days.push(dayData || { date, events: [] });
        }
        return days;
    }, [data, weekStart]);

    if (isLoading) {
        return (
            <div
                className={styles.pageWrapper}
                style={{ backgroundImage: `url(${theme.background})` }}
            >
                <LoadingSpinner message="Loading week..." fullPage={false} />
            </div>
        );
    }

    const weekEnd = addDays(weekStart, 6);
    const weekLabel = `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;

    return (
        <div className={styles.pageWrapper} style={{ backgroundImage: `url(${theme.background})` }}>
            <div className={styles.header}>
                <button className={styles.navButton} onClick={prev} aria-label="Previous week">
                    ◀
                </button>
                <div className={styles.headerContent}>
                    <h2 className={styles.weekTitle}>{weekLabel}</h2>
                    {!isCurrentWeek && (
                        <button className={styles.todayButton} onClick={goToToday}>
                            Today
                        </button>
                    )}
                </div>
                <button className={styles.navButton} onClick={next} aria-label="Next week">
                    ▶
                </button>
            </div>

            <div className={styles.calendarGrid}>
                {weekDays.map((day) => {
                    const isToday = formatIsoDate(day.date) === formatIsoDate(today);
                    const dayOfWeek = day.date.toLocaleDateString("en-US", { weekday: "short" });
                    const dayNumber = day.date.getDate();
                    const month = day.date.toLocaleDateString("en-US", { month: "short" });

                    return (
                        <div
                            key={day.date.toISOString()}
                            className={`${styles.dayColumn} ${
                                isToday ? styles.dayColumnToday : ""
                            }`}
                        >
                            <div
                                className={styles.dayHeader}
                                onClick={() => navigate({ to: `/${formatIsoDate(day.date)}` })}
                            >
                                <div className={styles.dayInfo}>
                                    <span className={styles.dayOfWeek}>{dayOfWeek}</span>
                                    <div className={styles.dayNumberContainer}>
                                        <span className={styles.dayNumber}>{dayNumber}</span>
                                        <span className={styles.month}>{month}</span>
                                    </div>
                                </div>
                                {day.events.length > 0 && (
                                    <span className={styles.eventCount}>{day.events.length}</span>
                                )}
                            </div>

                            <div className={styles.eventsList}>
                                {day.events.length === 0 ? (
                                    <div className={styles.emptyDay}>No events</div>
                                ) : (
                                    day.events.map((event) => {
                                        const eventColor = getEventColorHex(
                                            event.color,
                                            theme.colorScheme
                                        );
                                        return (
                                            <div
                                                key={event.id}
                                                className={styles.eventItem}
                                                style={
                                                    {
                                                        "--event-color": eventColor,
                                                    } as React.CSSProperties
                                                }
                                                onClick={() =>
                                                    navigate({ to: `/${formatIsoDate(day.date)}` })
                                                }
                                            >
                                                <div className={styles.eventColorBar} />
                                                <div className={styles.eventContent}>
                                                    <div className={styles.eventTitle}>
                                                        {event.title}
                                                    </div>
                                                    <div className={styles.eventTime}>
                                                        {formatTime(event.start)} -{" "}
                                                        {formatTime(event.end)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
