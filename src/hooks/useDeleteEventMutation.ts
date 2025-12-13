import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { deleteEvent } from "../services/eventService";
import { getMonday, formatIsoDate } from "../utils/dateUtils";
import type { CalendarEvent, DayEvents, WeekEvents } from "../types/EventTypes";

export const useDeleteEventMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation<
        void,
        unknown,
        CalendarEvent,
        { prevDay?: DayEvents; prevWeek?: WeekEvents }
    >({
        mutationFn: async (event: CalendarEvent) => {
            return await deleteEvent(event.id, accessToken!);
        },
        onMutate: async (event: CalendarEvent) => {
            console.debug("useDeleteEventMutation.onMutate", event.id);
            const dayKey = ["events", "day", formatIsoDate(event.start)];
            const weekKey = ["events", "week", formatIsoDate(getMonday(event.start))];

            await queryClient.cancelQueries({ queryKey: dayKey });
            await queryClient.cancelQueries({ queryKey: weekKey });

            const prevDay = queryClient.getQueryData<DayEvents>(dayKey);
            const prevWeek = queryClient.getQueryData<WeekEvents>(weekKey);

            queryClient.setQueryData<DayEvents | undefined>(dayKey, (old) => {
                if (!old) return old;
                return { ...old, events: old.events.filter((e) => e.id !== event.id) };
            });

            queryClient.setQueryData<WeekEvents | undefined>(weekKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    days: old.days.map((d) =>
                        formatIsoDate(d.date) === formatIsoDate(event.start)
                            ? { ...d, events: d.events.filter((e) => e.id !== event.id) }
                            : d
                    ),
                } as WeekEvents;
            });

            return { prevDay, prevWeek };
        },
        onError: (
            _err,
            variables?: CalendarEvent,
            context?: { prevDay?: DayEvents; prevWeek?: WeekEvents }
        ) => {
            console.error("useDeleteEventMutation.onError", _err, variables);
            if (!variables) return;
            if (context?.prevDay) {
                queryClient.setQueryData(
                    ["events", "day", formatIsoDate(variables.start)],
                    context.prevDay
                );
            }
            if (context?.prevWeek) {
                queryClient.setQueryData(
                    ["events", "week", formatIsoDate(getMonday(variables.start))],
                    context.prevWeek
                );
            }
        },
        onSettled: (_, _err, variables?: CalendarEvent) => {
            console.debug("useDeleteEventMutation.onSettled", variables?.id);
            if (!variables) return;
            const dayKey = ["events", "day", formatIsoDate(variables.start)];
            const weekKey = ["events", "week", formatIsoDate(getMonday(variables.start))];

            queryClient.invalidateQueries({ queryKey: dayKey });
            queryClient.invalidateQueries({ queryKey: weekKey });
        },
    });
};
