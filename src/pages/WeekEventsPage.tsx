import { useState } from "react";
import { useWeekEventsQuery } from "../hooks/useWeekEventsQuery";

export const WeekEventsPage = () => {
    const [date, setDate] = useState<Date>(new Date());
    const { data, isLoading, isError } = useWeekEventsQuery(date);

    const goToNextWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 7);
        setDate(newDate);
    };
    const goToPrevWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 7);
        setDate(newDate);
    };

    if (isError) return <h1>Error Loading</h1>;
    if (isLoading) return <h1>Loading...</h1>;
    return (
        <>
            {data?.map((e) => (
                <div key={e.id}>
                    <p>{e.id}</p>
                    <p>{e.title}</p>
                    <p>{String(e.start)}</p>
                    <p>{String(e.end)}</p>
                    <p>{String(e.color)}</p>
                </div>
            ))}
            <button onClick={goToNextWeek}>next</button>
            <button onClick={goToPrevWeek}>prev</button>
        </>
    );
};
