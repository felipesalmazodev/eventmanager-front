import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { AuthGate } from "@/components/AuthGate";
import Header from "@/components/Header"

export const metadata: Metadata = {
    title: "Event Manager",
    description: "Event and place management system",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <AuthGate>
                    <Header />
                    <main className="container mt-4">
                        {children}
                    </main>
                </AuthGate>
            </body>
        </html>
    );
}