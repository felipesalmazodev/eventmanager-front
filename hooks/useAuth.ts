"use client";

import { useAuthStore } from "@/stores/auth-store";

// this hook centralizes all operations of authentication. the components doesn't know how the authentication works.

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