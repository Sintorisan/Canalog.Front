const baseUrl = import.meta.env.VITE_BASE_URL;

export const getTodayEvents = async () => {
    const response = await fetch(baseUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch events.");
    }
    return response.json();
};
