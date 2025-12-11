import { useTodayEventsQuery } from "../hooks/useTodayEventsQuery";

export const TodayEventsPage = () => {
    const { data, isLoading, isError } = useTodayEventsQuery();

    if (isError) return <h1>Error Loading</h1>;
    if (isLoading) return <h1>Loading...</h1>;

    return (
        <div>
            {data?.map((e) => (
                <div key={e.id}>
                    <p>{e.id}</p>
                    <p>{e.title}</p>
                    <p>{String(e.start)}</p>
                    <p>{String(e.end)}</p>
                    <p>{String(e.color)}</p>
                </div>
            ))}
        </div>
    );
};
