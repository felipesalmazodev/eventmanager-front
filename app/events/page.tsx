"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { eventsService, type EventListDto } from "@/services/events";
import { ConfirmModal } from "@/components/ConfirmModal";
import { formatDateTime } from "@/lib/date-format";

export default function EventsPage() {
    const [events, setEvents] = useState<EventListDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);
    

    async function load() {
        try {
            setError(null);
            setEvents(await eventsService.list());
        } catch (e: any) {
            setError(e?.message ?? "Failed to load events");
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            setBusyId(deleteTarget.id);

            await eventsService.remove(deleteTarget.id);
            setDeleteTarget(null);
            await load();
        } catch (e: any) {
            alert(e?.message ?? "Failed to delete event");
        } finally {
            setDeleting(false);
            setBusyId(null);
        }
    }

    function cancelDelete() {
        if (deleting) return;
        setDeleteTarget(null);
    }


    useEffect(() => { load(); }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 m-0">Events</h1>
                <div className="d-flex gap-2">
                    <Link className="btn btn-primary btn-sm" href="/events/new">
                        Create
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>{error}</div>}

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Starts at</th>
                            <th>Finishes at</th>
                            <th>Place</th>
                            <th style={{ width: 240 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((ev) => (
                            <tr key={ev.id}>
                                <td>{ev.name}</td>
                                <td>{formatDateTime(ev.startsAt)}</td>
                                <td>{formatDateTime(ev.finishesAt)}</td>
                                <td>{ev.place?.code}</td>
                                <td className="text-end">
                                    <Link className="btn btn-outline-secondary btn-sm me-2" href={`/events/${ev.id}`}>
                                        Details
                                    </Link>
                                    <Link className="btn btn-outline-primary btn-sm me-2" href={`/events/${ev.id}/edit`}>
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => setDeleteTarget({ id: ev.id, name: ev.name })}
                                        disabled={busyId === ev.id}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {events.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-body-secondary py-4">
                                    No events yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ConfirmModal
                show={!!deleteTarget}
                title="Delete event"
                body={
                    <p className="mb-0">
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
                        This action cannot be undone.
                    </p>
                }
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                busy={deleting}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

        </div>
    );
}
