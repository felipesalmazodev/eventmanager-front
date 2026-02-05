import { useAuth } from "@/hooks/useAuth";

// This service handles all the requests for the backend 

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiErrorResponse = {
    timestamp: string;
    status: number;
    errors: Record<string, string[]>;
};

// This function formats the erros coming from the backend whenever a exception is thrown
function formatApiErrors(err: ApiErrorResponse): string {
    const errors = err.errors ?? {};
    const firstFieldErrors = Object.values(errors)[0];
    if (!firstFieldErrors || firstFieldErrors.length === 0) return "";
    return firstFieldErrors[0];
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");

    const { token, logout } = useAuth();

    const userToken = typeof window === "undefined" ? null : token;

    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
            ...(init.headers ?? {}),
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");

        if (res.status === 401) {
            if (typeof window !== "undefined") logout();
            throw new Error("Not authenticated, please log in.");
        }

        try {
            const parsed = JSON.parse(text) as ApiErrorResponse;
            const msg = formatApiErrors(parsed) || `HTTP ${res.status}`;
            throw new Error(msg);
        } catch (err: any) {
            if (err instanceof Error && err.message) throw err;
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