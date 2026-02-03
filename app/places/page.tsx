"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { placesService, PlaceListDto } from "@/services/places";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function PlacesPage() {
    const [places, setPlaces] = useState<PlaceListDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    async function load() {
        try {
            setError(null);
            setPlaces(await placesService.list());
        } catch (e: any) {
            setError(e?.message ?? "Erro on loading places");
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            setBusyId(deleteTarget.id);

            await placesService.remove(deleteTarget.id);
            setDeleteTarget(null);
            await load();
        } catch (e: any) {
            alert(e?.message ?? "Failed to delete place");
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
                <h1 className="h4 m-0">Places</h1>
                <div className="d-flex gap-2">
                    <Link className="btn btn-primary btn-sm" href={`/places/new`}>
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
                            <th>Code</th>
                            <th>CEP</th>
                            <th>Capacity</th>
                            <th style={{ width: 220 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {places.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.code}</td>
                                <td>{p.cep}</td>
                                <td>{p.capacity}</td>
                                <td className="text-end">
                                    <Link className="btn btn-outline-secondary btn-sm me-2" href={`/places/${p.id}`}>
                                        Details
                                    </Link>
                                    <Link className="btn btn-outline-primary btn-sm me-2" href={`/places/${p.id}/edit`}>
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                                        disabled={busyId === p.id}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                        {places.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-body-secondary py-4">
                                    No places yet
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
