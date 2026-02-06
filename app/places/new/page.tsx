"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlaceForm } from "@/components/PlaceForm";
import { placesService, PlaceUpsertRequest } from "@/services/places";

export default function NewPlacePage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(values: PlaceUpsertRequest) {
        try {
            setSubmitting(true);
            setError(null);
            await placesService.create(values);
            router.push("/places");
        } catch (e: any) {
            setError(e?.message ?? "Error at creating place");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 m-0">Create Place</h1>
                <Link className="btn btn-outline-secondary btn-sm" href="/places">Back</Link>
            </div>

            {error && <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>{error}</div>}

            <div className="card">
                <div className="card-body">
                    <PlaceForm submitLabel="Create" submitting={submitting} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    );
}
