import { useState } from "react";
import { useWeekEventsQuery } from "../hooks/useWeekEventsQuery";
import { addDays, getMonday } from "../utils/dateUtils";

export const WeekEventsPage = () => {
    const [weekStart, setWeekStart] = useState(getMonday(new Date()));

    const next = () => setWeekStart((prev) => addDays(prev, 7));
    const prev = () => setWeekStart((prev) => addDays(prev, -7));

    const { data, isLoading } = useWeekEventsQuery(weekStart);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div>
            <button onClick={prev}>Previous</button>
            <h2>Week of {weekStart.toDateString()}</h2>
            <button onClick={next}>Next</button>

            {data?.days.map((d, i) => (
                <div key={i}>
                    <h3>{String(d.date)}</h3>
                    {d.events.map((e) => (
                        <p key={e.id}>{e.title}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};
