"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const TOKEN_KEY = "eventmanager_token";

type AuthState = {
    token: string | null;
    hasHydrated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
    markHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            hasHydrated: false,

            setToken: (token) => set({ token }),
            logout: () => set({ token: null }),
            markHydrated: () => set({ hasHydrated: true }),
        }),
        {
            name: TOKEN_KEY,
            partialize: (state) => ({ token: state.token }),
        }
    )
);

if (typeof window !== "undefined") {

    if (useAuthStore.persist.hasHydrated()) {
        useAuthStore.getState().markHydrated();
    }

    useAuthStore.persist.onFinishHydration(() => {
        useAuthStore.getState().markHydrated();
    });

    useAuthStore.persist.rehydrate();
}

export function getAuthToken(): string | null {
    return useAuthStore.getState().token;
}

if (typeof window !== "undefined") {
    useAuthStore.persist.rehydrate();
}