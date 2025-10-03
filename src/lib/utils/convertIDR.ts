export function convertIDR(value: number | string | undefined | null) {
    const num = Number(value || 0);
    if (isNaN(num)) {
        return "Rp 0";
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}