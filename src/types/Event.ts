export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color: number;
};

export type EventApiResponse = {
    id: string;
    title: string;
    start: string;
    end: string;
    color: number;
};

export type EventRequest = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color: number;
};
