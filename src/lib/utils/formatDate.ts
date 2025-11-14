const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
};

const LOCALE = "id-ID";

/**
 * Formats a date range into a "DD/MM/YYYY - DD/MM/YYYY" string.
 * @param startDate - The start date (string or Date object).
 * @param endDate - The end date (string or Date object).
 * @returns The formatted date range string, or '-' if dates are invalid.
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
    if (!startDate || !endDate) return '-';

    const formattedStart = new Date(startDate).toLocaleDateString(LOCALE, DATE_OPTIONS);
    const formattedEnd = new Date(endDate).toLocaleDateString(LOCALE, DATE_OPTIONS);

    return `${formattedStart} - ${formattedEnd}`;
}