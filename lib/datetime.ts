// "2026-02-05T10:30" -> "2026-02-05T10:30:00"
export function toBackendLocalDateTime(dtLocal: string): string {
    if (!dtLocal) return "";
    return dtLocal.length === 16 ? `${dtLocal}:00` : dtLocal;
}

// "2026-02-05T10:30:00" -> "2026-02-05T10:30"
export function toDatetimeLocalInput(apiValue: string): string {
    if (!apiValue) return "";
    return apiValue.length >= 16 ? apiValue.slice(0, 16) : apiValue;
}
