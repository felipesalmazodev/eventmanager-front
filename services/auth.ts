export const TOKEN_KEY = "eventmanager_token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function getGoogleLoginUrl() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    const override = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL;

    if (override && override.trim()) return override.trim();
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");
    return `${base}/oauth2/authorization/google`;
}