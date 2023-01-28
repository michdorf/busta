export function toISOstr(d: Date | string) {
    if (typeof d == "string") {
        return d.split('T')[0]
    }
    return d.toISOString().split('T')[0];
}

export function primoDelMese(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function primoProssMese(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}
export function ultimoDelMese(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function monthsDiff(d1: Date, d2: Date) {
    d1 = typeof d1 == "string" ? new Date(d1) : d1;
    d2 = typeof d2 == "string" ? new Date(d2) : d2;
    d1 = primoDelMese(d1);
    d2 = primoDelMese(d2);

    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months += d2.getMonth() - d1.getMonth();
    return Math.abs(months);
}