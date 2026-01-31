"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PlaceForm } from "@/components/PlaceForm";
import {
  placesService,
  PlaceDetailsDto,
  PlaceUpsertRequest,
} from "@/services/places";

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [initial, setInitial] = useState<PlaceDetailsDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load(placeId: number) {
    try {
      setError(null);
      setInitial(await placesService.get(placeId));
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar place");
    }
  }

  async function onSubmit(values: PlaceUpsertRequest) {
    try {
      setSubmitting(true);
      setError(null);
      await placesService.update(id, values);
      router.push("/places");
    } catch (e: any) {
      setError(e?.message ?? "Erro ao atualizar place");
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
        <h1 className="h4 m-0">Edit Place</h1>
        <Link className="btn btn-outline-secondary btn-sm" href={`/places/${id}`}>
          Back
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      )}

      {!initial && !error && (
        <div className="alert alert-info">Loading...</div>
      )}

      {initial && (
        <div className="card">
          <div className="card-body">
            <PlaceForm
              initialValues={initial}
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
