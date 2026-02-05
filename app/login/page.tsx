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
        <div className="container-fluid min-vh-100 p-0">
            <div className="row g-0 min-vh-100">
                <div className="col-md-7 d-flex flex-column justify-content-center p-5">
                    <h1
                        className="display-4 fw-bold mb-3"
                        style={{
                            textShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        Event Manager
                    </h1>

                    <p
                        className="lead mb-4"
                        style={{
                            textShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        }}
                    >
                        Organize your events in one place.
                    </p>

                    <p
                        className="text-muted"
                        style={{
                            maxWidth: 520,
                        }}
                    >
                        Create events, manage locations and avoid conflicts with a clean,
                        modern and easy-to-use interface designed to simplify your workflow.
                    </p>
                </div>

                <div className="col-md-5 d-flex justify-content-center align-items-center bg-light">
                    <div className="card shadow-lg w-100" style={{ maxWidth: 420 }}>
                        <div className="card-body p-4 p-md-5">
                            <h2 className="h4 mb-3">Welcome!</h2>
                            <p className="text-muted mb-4">
                                Sign in with your Google account to continue
                            </p>

                            <button className="btn btn-dark w-100 py-2" onClick={login}>
                                <i className="bi bi-google me-2" />
                                Continue with Google
                            </button>

                            <p
                                className="text-center text-muted mt-4 mb-0"
                                style={{ fontSize: 14 }}
                            >
                                Secure login powered by Google OAuth
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getGoogleLoginUrl() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL not configured");
    return `${base}/oauth2/authorization/google`;
}