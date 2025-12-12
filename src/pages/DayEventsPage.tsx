// Swap this import when testing
import { useDayEventsQuery } from "../mock/useDayEventsQuery.mock";
// import { useDayEventsQuery } from "../hooks/useDayEventsQuery";

import { ThemeContext, mockTheme } from "../mock/ThemeContext.mock";
import { DayClock } from "../components/clock/DayClock";

export const DayEventsPage = () => {
    const { data, isLoading, isError } = useDayEventsQuery();

    if (isError) return <h1>Error Loading</h1>;
    if (isLoading) return <h1>Loading...</h1>;

    return (
        <ThemeContext.Provider value={mockTheme}>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `url(${mockTheme.background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <DayClock day={data} />
            </div>{" "}
        </ThemeContext.Provider>
    );
};
