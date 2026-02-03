"use client";

import { getGoogleLoginUrl } from "@/services/auth";

export default function LoginPage() {
    function login() {
        const url = getGoogleLoginUrl();
        window.location.href = url;
    }

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
