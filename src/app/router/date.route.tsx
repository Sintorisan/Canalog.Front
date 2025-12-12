import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { DayEventsPage } from "../../pages/DayEventsPage";

export const dateRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/$date",
    component: DayEventsPage,
});
