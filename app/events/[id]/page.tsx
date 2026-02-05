"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eventsService, type EventDetailsDto } from "@/services/events";
import { formatDateTime } from "@/lib/date-format";

export default function EventDetailsPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);

    const [enrich, setEnrich] = useState(false);
    const [data, setData] = useState<EventDetailsDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load(eventId: number, enrichPlace: boolean) {
        try {
            setError(null);
            setData(await eventsService.get(eventId, enrichPlace));
        } catch (e: any) {
            setError(e?.message ?? "Failed to load event details");
        }
    }

    useEffect(() => {
        if (!Number.isFinite(id)) return;
        load(id, enrich);
    }, [id, enrich]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 m-0">Event Details</h1>
                <div className="d-flex gap-2">
                    <Link className="btn btn-outline-secondary btn-sm" href="/events">
                        Back
                    </Link>
                    <Link className="btn btn-primary btn-sm" href={`/events/${id}/edit`}>
                        Edit
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>{error}</div>}
            {!data && !error && <div className="alert alert-info">Loading...</div>}

            {data && (
                <>
                    <div className="card mb-3">
                        <div className="card-body">
                            <h2 className="h5">{data.name}</h2>
                            <div className="text-body-secondary">
                                {formatDateTime(data.startsAt)} → {formatDateTime(data.finishesAt)}
                            </div>
                            {data.description && <p className="mt-2 mb-0">{data.description}</p>}
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header bg-dark d-flex justify-content-between align-items-center">
                            <span className="text-white">Place</span>

                            <div className="form-check form-switch m-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={enrich}
                                    onChange={(e) => setEnrich(e.target.checked)}
                                    id="enrichSwitch"
                                />
                                <label className="form-check-label text-white" htmlFor="enrichSwitch">
                                    Enrich address (ViaCEP)
                                </label>
                            </div>
                        </div>

                        <div className="card-body">
                            <div><strong>Name:</strong> {data.place.name}</div>
                            <div><strong>Code:</strong> {data.place.code}</div>
                            <div><strong>CEP:</strong> {data.place.cep}</div>
                            <div><strong>Capacity:</strong> {data.place.capacity}</div>
                            <div><strong>Number:</strong> {data.place.number}</div>

                            {enrich && (
                                <div className="mt-3">
                                    <h3 className="h6">Address preview</h3>
                                    {!data.address ? (
                                        <div className="alert alert-warning mb-0">
                                            No address returned.
                                        </div>
                                    ) : (
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Street</label>
                                                <input className="form-control" disabled value={data.address.logradouro} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Neighborhood</label>
                                                <input className="form-control" disabled value={data.address.bairro} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">City</label>
                                                <input className="form-control" disabled value={data.address.localidade} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">State</label>
                                                <input className="form-control" disabled value={data.address.uf} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
