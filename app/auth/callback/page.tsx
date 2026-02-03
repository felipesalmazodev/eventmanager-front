"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/services/auth";

export default function AuthCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = params.get("token");
        const err = params.get("error");

        if (err) {
            setError(err);
            return;
        }

        if (!token) {
            setError("Token não encontrado na URL de callback.");
            return;
        }

        setToken(token);
        router.replace("/");
    }, [params, router]);

    return (
        <div className="container py-5" style={{ maxWidth: 520 }}>
            <h1 className="h5 mb-3">Finalizando login…</h1>
            {error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <p className="text-muted">Aguarde, redirecionando…</p>
            )}
        </div>
    );
}
