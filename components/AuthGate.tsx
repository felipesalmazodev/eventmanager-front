"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getToken } from "@/services/auth";
import { api } from "@/services/api";

const PUBLIC_PATHS = new Set<string>([
    "/login",
    "/auth/callback",
]);

export function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function check() {
            if (PUBLIC_PATHS.has(pathname)) {
                setReady(true);
                return;
            }

            const token = getToken();
            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                await api<any>("/api/auth/me", { method: "GET" });
                setReady(true);
            } catch {
                clearToken();
                router.replace("/login");
            }
        }

        check();
    }, [pathname, router]);

    if (!ready) return null;
    return <>{children}</>;
}
