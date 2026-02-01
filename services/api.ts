const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiErrorResponse = {
    timestamp: string;
    status: number;
    errors: Record<string, string[]>;
};

function formatApiErrors(err: ApiErrorResponse) {
    const lines: string[] = [];
    for (const [field, msgs] of Object.entries(err.errors ?? {})) {
        for (const m of msgs) lines.push(`${field}: ${m}`);
    }
    return lines.join("\n");
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada");

    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        try {
            const parsed = JSON.parse(text) as ApiErrorResponse;
            throw new Error(formatApiErrors(parsed) || `HTTP ${res.status}`);
        } catch {
            throw new Error(text || `HTTP ${res.status}`);
        }
    }


    if (res.status === 204) return undefined as T;

    const text = await res.text().catch(() => "");
    if (!text) return undefined as T;

    try {
        return JSON.parse(text) as T;
    } catch {
        return text as unknown as T;
    }
}