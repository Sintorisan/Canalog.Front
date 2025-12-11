export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    eventColor: number;
};

export type EventApiResponse = {
    id: string;
    title: string;
    start: string;
    end: string;
    eventColor: number;
};

export type EventRequest = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    eventColor: number;
};
