"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { placesService, PlaceDetailsDto } from "@/services/places";

export default function PlaceDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [data, setData] = useState<PlaceDetailsDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(placeId: number) {
    try {
      setError(null);
      setData(await placesService.get(placeId));
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar detalhes");
    }
  }

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    load(id);
  }, [id]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Place Details</h1>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary btn-sm" href="/places">
            Back
          </Link>
          <Link className="btn btn-primary btn-sm" href={`/places/${id}/edit`}>
            Edit
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      )}
      {!data && !error && <div className="alert alert-info">Loading...</div>}

      {data && (
        <div className="card">
          <div className="card-body">
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Code:</strong> {data.code}</div>
            <div><strong>CEP:</strong> {data.cep}</div>
            <div><strong>Capacity:</strong> {data.capacity}</div>
            <div><strong>Number:</strong> {data.number}</div>
            {data.complement && <div><strong>Complement:</strong> {data.complement}</div>}
            {data.reference && <div><strong>Reference:</strong> {data.reference}</div>}
          </div>
        </div>
      )}
    </div>
  );
}