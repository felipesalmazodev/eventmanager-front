"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EventForm } from "@/components/EventForm";
import { eventsService, type EventUpsertRequest } from "@/services/events";

export default function NewEventPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(values: EventUpsertRequest) {
        try {
            setSubmitting(true);
            setError(null);
            await eventsService.create(values);
            router.push("/events");
        } catch (e: any) {
            setError(e?.message ?? "Failed to create event");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 m-0">Create Event</h1>
                <Link className="btn btn-outline-secondary btn-sm" href="/events">
                    Back
                </Link>
            </div>

            {error && <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>{error}</div>}

            <div className="card">
                <div className="card-body">
                    <EventForm submitLabel="Create" submitting={submitting} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    );
}
