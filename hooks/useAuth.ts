"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
    const token = useAuthStore((s) => s.token);
    const login = useAuthStore((s) => s.setToken);
    const logout = useAuthStore((s) => s.logout);

    return {
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };
}