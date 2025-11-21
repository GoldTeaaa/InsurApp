export default function x(inputDate: string) {
    if (!inputDate) return "-";
    const date = new Date(inputDate);
    return date.toLocaleDateString("id-ID");
}