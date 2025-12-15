export const getMonday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;

    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const formatIsoDate = (date: Date) => {
    const local = new Date(date);
    local.setHours(0, 0, 0, 0);

    const y = local.getFullYear();
    const m = (local.getMonth() + 1).toString().padStart(2, "0");
    const d = local.getDate().toString().padStart(2, "0");

    return `${y}-${m}-${d}`;
};

export const parseIsoDate = (iso: string): Date | null => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;

    const [y, m, d] = iso.split("-").map(Number);

    // LOCAL midnight
    return new Date(y, m - 1, d, 0, 0, 0, 0);
};

export const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const parseUtcToLocal = (iso: string): Date => {
    const d = new Date(iso); // interpreted in local timezone
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds()
    );
};
