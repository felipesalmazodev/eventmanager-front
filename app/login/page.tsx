"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    function login() {
        const url = getGoogleLoginUrl();
        window.location.href = url;
    }

    if (isAuthenticated) return null;

    return (
        <div className="container py-5" style={{ maxWidth: 520 }}>
            <h1 className="h3 mb-3">Login</h1>
            <p className="text-muted">
                Log in with a Google account to access Event Manager
            </p>

            <button className="btn btn-outline-dark w-100" onClick={login}>
                Google login
            </button>
        </div>
    );
}

function getGoogleLoginUrl() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");
    return `${base}/oauth2/authorization/google`;
}