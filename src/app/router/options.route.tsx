import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { OptionsPage } from "../../pages/OptionsPage";

export const optionsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/options",
    component: OptionsPage,
});


