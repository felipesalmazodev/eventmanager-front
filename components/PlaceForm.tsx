"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PlaceUpsertRequest } from "@/services/places";

const placeSchema = z.object({
    name: z.string().min(1, "This field is mandatory").max(255),
    code: z
        .string()
        .min(1, "This field is mandatory")
        .max(255)
        .regex(/^[A-Za-z0-9]+$/, "Only numbers and letters is permitted"),
    capacity: z.coerce.number().min(10, "The minimum capacity is 10"),
    cep: z.string().regex(/^\d{8}$/, "The CEP must contain 8 numbers"),
    number: z.coerce.number().min(0, "Invalid number"),
    complement: z.string().optional().nullable(),
    reference: z.string().optional().nullable(),
});

type PlaceFormInput = z.input<typeof placeSchema>;
type PlaceFormOutput = z.output<typeof placeSchema>;

type ViaCepAddress = {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
};

export function PlaceForm({
    initialValues,
    onSubmit,
    submitting,
    submitLabel,
}: {
    initialValues?: Partial<PlaceUpsertRequest>;
    onSubmit: (values: PlaceUpsertRequest) => Promise<void> | void;
    submitting?: boolean;
    submitLabel: string;
}) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PlaceFormInput>({
        resolver: zodResolver(placeSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            code: initialValues?.code ?? "",
            capacity: (initialValues?.capacity ?? 10) as any,
            cep: initialValues?.cep ?? "",
            number: (initialValues?.number ?? 0) as any,
            complement: initialValues?.complement ?? "",
            reference: initialValues?.reference ?? "",
        },
        mode: "onTouched",
    });

    const cep = watch("cep");

    const [address, setAddress] = useState<ViaCepAddress | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [loadingAddress, setLoadingAddress] = useState(false);

    const debounceMs = 400;
    const debouncedCep = useMemo(() => cep, [cep]);

    useEffect(() => {
        setAddress(null);
        setAddressError(null);

        if (!/^\d{8}$/.test(debouncedCep ?? "")) return;

        const t = setTimeout(async () => {
            try {
                setLoadingAddress(true);
                setAddressError(null);

                const res = await fetch(`/api/viacep/${debouncedCep}`, { cache: "no-store" });
                if (!res.ok) {
                    const msg = res.status === 404 ? "CEP not found" : "Unable to validate CEP";
                    throw new Error(msg);
                }

                const data = (await res.json()) as ViaCepAddress;
                setAddress({
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    localidade: data.localidade,
                    uf: data.uf,
                });
            } catch (e: any) {
                setAddress(null);
                setAddressError(e?.message ?? "Unable to validate CEP");
            } finally {
                setLoadingAddress(false);
            }
        }, debounceMs);

        return () => clearTimeout(t);
    }, [debouncedCep]);

    const submit: SubmitHandler<PlaceFormInput> = async (values) => {
        const parsed: PlaceFormOutput = placeSchema.parse(values);

        const payload: PlaceUpsertRequest = {
            ...parsed,
            complement: parsed.complement?.trim() ? parsed.complement : null,
            reference: parsed.reference?.trim() ? parsed.reference : null,
        };

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="row g-3">
            <div className="col-md-6">
                <label className="form-label">Name</label>
                <input className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name")} />
                {errors.name && <div className="invalid-feedback">{errors.name.message as string}</div>}
            </div>

            <div className="col-md-6">
                <label className="form-label">Code</label>
                <input className={`form-control ${errors.code ? "is-invalid" : ""}`} {...register("code")} />
                {errors.code && <div className="invalid-feedback">{errors.code.message as string}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label">Capacity</label>
                <input type="number" className={`form-control ${errors.capacity ? "is-invalid" : ""}`} {...register("capacity")} />
                {errors.capacity && <div className="invalid-feedback">{errors.capacity.message as string}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label">CEP</label>
                <input className={`form-control ${errors.cep ? "is-invalid" : ""}`} {...register("cep")} />
                <div className="form-text">8 digits, no hyphen. Example: 01001000</div>
                {errors.cep && <div className="invalid-feedback">{errors.cep.message as string}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label">Number</label>
                <input type="number" className={`form-control ${errors.number ? "is-invalid" : ""}`} {...register("number")} />
                {errors.number && <div className="invalid-feedback">{errors.number.message as string}</div>}
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>Address preview (ViaCEP)</span>
                        {loadingAddress && <span className="badge text-bg-secondary">Loading...</span>}
                    </div>
                    <div className="card-body">
                        {addressError && <div className="alert alert-warning mb-3">{addressError}</div>}

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Street</label>
                                <input className="form-control" disabled value={address?.logradouro ?? ""} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Neighborhood</label>
                                <input className="form-control" disabled value={address?.bairro ?? ""} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">City</label>
                                <input className="form-control" disabled value={address?.localidade ?? ""} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">State</label>
                                <input className="form-control" disabled value={address?.uf ?? ""} />
                            </div>
                        </div>

                        <div className="form-text mt-2">
                            This preview is for validation only and is not saved.
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <label className="form-label">Complement (optional)</label>
                <input className="form-control" {...register("complement")} />
            </div>

            <div className="col-md-6">
                <label className="form-label">Reference (optional)</label>
                <input className="form-control" {...register("reference")} />
            </div>

            <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary" type="submit" disabled={!!submitting}>
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
