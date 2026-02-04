export const TOKEN_KEY = "eventmanager_token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;

    const { getAuthToken } = require("@/stores/auth-store") as typeof import("@/stores/auth-store");
    return getAuthToken();
}

export function setToken(token: string) {
    const { useAuthStore } = require("@/stores/auth-store") as typeof import("@/stores/auth-store");
    useAuthStore.getState().setToken(token);
}

export function clearToken() {
    const { useAuthStore } = require("@/stores/auth-store") as typeof import("@/stores/auth-store");
    useAuthStore.getState().logout();
}

export function getGoogleLoginUrl() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    const override = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL;

    if (override && override.trim()) return override.trim();
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");
    return `${base}/oauth2/authorization/google`;
}