"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EventForm } from "@/components/EventForm";
import { eventsService, type EventDetailsDto, type EventUpsertRequest } from "@/services/events";

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = Number(params.id);

    const [initial, setInitial] = useState<EventDetailsDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function load(eventId: number) {
        try {
            setError(null);
            setInitial(await eventsService.get(eventId, false));
        } catch (e: any) {
            setError(e?.message ?? "Failed to load event");
        }
    }

    async function onSubmit(values: EventUpsertRequest) {
        try {
            setSubmitting(true);
            setError(null);
            await eventsService.update(id, values);
            router.push("/events");
        } catch (e: any) {
            setError(e?.message ?? "Failed to update event");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (!Number.isFinite(id)) return;
        load(id);
    }, [id]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 m-0">Edit Event</h1>
                <Link className="btn btn-outline-secondary btn-sm" href={"/events"}>
                    Back
                </Link>
            </div>

            {error && <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>{error}</div>}
            {!initial && !error && <div className="alert alert-info">Loading...</div>}

            {initial && (
                <div className="card">
                    <div className="card-body">
                        <EventForm
                            initialValues={{
                                name: initial.name,
                                startsAt: initial.startsAt,
                                finishesAt: initial.finishesAt,
                                placeCode: initial.place.code,
                                description: initial.description ?? "",
                            }}
                            submitLabel="Save"
                            submitting={submitting}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
