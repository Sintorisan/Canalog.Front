import { useMemo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useWeekEventsQuery } from "../hooks/useWeekEventsQuery";
import { useTheme } from "../context/ThemeContext";
import { DayClock } from "../components/clock/DayClock";
import { addDays, getMonday, formatIsoDate, parseIsoDate } from "../utils/dateUtils";
import styles from "./DayEventsPage.module.css";

export const DayEventsPage = () => {
    const navigate = useNavigate();
    const { location } = useRouterState();
    const theme = useTheme();

    const pathSeg =
        location?.pathname && location.pathname !== "/" ? location.pathname.slice(1) : null;
    const ignoreSegments = ["login", "week"];
    const normalizedSeg = pathSeg && !ignoreSegments.includes(pathSeg) ? pathSeg : null;
    const paramDate = normalizedSeg ? parseIsoDate(normalizedSeg) : null;
    const date = useMemo(() => paramDate ?? new Date(), [paramDate]);

    // Prefetch the whole week that contains `date` so day navigation within week is instant
    const weekStart = useMemo(() => getMonday(date), [date]);
    const { data: weekData, isLoading, isError } = useWeekEventsQuery(weekStart);

    const goToDate = (d: Date) => navigate({ to: `/${formatIsoDate(d)}` });

    const goToToday = () => goToDate(new Date());
    const goToPreviousDay = () => goToDate(addDays(date, -1));
    const goToNextDay = () => goToDate(addDays(date, 1));

    if (isError) return <h1>Error loading events</h1>;
    if (isLoading || !weekData) return <h1>Loading...</h1>;

    const readableDate = date.toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Find the DayEvents object for the selected date inside the prefetched week
    const isoDate = formatIsoDate(date);
    const day =
        weekData.days.find((d) => formatIsoDate(d.date) === isoDate) ||
        ({ date, events: [] } as (typeof weekData.days)[number]);

    return (
        <div className={styles.pageWrapper} style={{ backgroundImage: `url(${theme.background})` }}>
            <div className={styles.header}>
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
