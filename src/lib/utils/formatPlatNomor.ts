export function formatPlatNomor(value: string | null | undefined): string {
    if (!value) return "";

    // Normalize: Remove spaces and convert to uppercase
    const clean = value.replace(/\s/g, "").toUpperCase();

    // Regex to group: (Area Code)(Number)(Suffix)
    // Matches: 1-2 letters, 1-4 digits, 1-3 letters
    const match = clean.match(/^([A-Z]{1,2})(\d{1,4})([A-Z]{1,3})$/);

    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }

    return clean;
}