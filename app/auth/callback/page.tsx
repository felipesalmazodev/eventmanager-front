"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    const { login } = useAuth();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = params.get("token");
        const err = params.get("error");

        if (err) {
            setError(err);
            return;
        }

        if (!token) {
            setError("Token not found on the callback URL.");
            return;
        }

        login(token);
        router.replace("/");
    }, [params, router, login]);

    return (
        <div className="container py-5" style={{ maxWidth: 520 }}>
            <h1 className="h5 mb-3">Finalizing login…</h1>
            {error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <p className="text-muted">Wait, redirecting</p>
            )}
        </div>
    );
}