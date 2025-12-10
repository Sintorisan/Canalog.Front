import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { TodayEventsPage } from "../../pages/TodayEventsPage";

export const todayRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: TodayEventsPage,
});
