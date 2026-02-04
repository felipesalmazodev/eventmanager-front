"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const PUBLIC_PATHS = new Set<string>(["/login", "/auth/callback"]);

// The authgate wrappers all pages because he is the responsible for checking if the user is logged in or not
// The function calls and endpoint on the backend for testing the jwt token.

export function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, logout } = useAuth();
    const [ready, setReady] = useState(false);

    const isPublic = useMemo(() => PUBLIC_PATHS.has(pathname), [pathname]);

    useEffect(() => {

        if (isPublic) {
            setReady(true);
            return;
        }

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        (async () => {
            try {
                await api<any>("/api/auth/me", { method: "GET" });
                setReady(true);
            } catch {
                logout();
                router.replace("/login");
            }
        })();
    }, [isPublic, isAuthenticated, router, logout]);

    if (!ready) {
        return (
            <div className="container py-5">
                <p className="text-muted">Loading…</p>
            </div>
        );
    }

    return <>{children}</>;
}