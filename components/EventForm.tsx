"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EventUpsertRequest } from "@/services/events";
import { toBackendLocalDateTime, toDatetimeLocalInput } from "@/lib/datetime";
import { placesService, type PlaceListDto } from "@/services/places";

const eventSchema = z.object({
    name: z.string().min(1, "This field is mandatory").max(255),
    startsAt: z.string().min(1, "This field is mandatory"),
    finishesAt: z.string().min(1, "This field is mandatory"),
    placeCode: z.string().min(1, "This field is mandatory"),
    description: z.string().optional().nullable(),
});

type EventFormInput = z.input<typeof eventSchema>;
type EventFormOutput = z.output<typeof eventSchema>;

type PlaceOption = { label: string; value: string };

function toOption(p: PlaceListDto): PlaceOption {
    return { label: p.name, value: p.code };
}

export function EventForm({
    initialValues,
    onSubmit,
    submitting,
    submitLabel,
}: {
    initialValues?: Partial<EventUpsertRequest>;
    onSubmit: (values: EventUpsertRequest) => Promise<void> | void;
    submitting?: boolean;
    submitLabel: string;
}) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<EventFormInput>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            startsAt: initialValues?.startsAt ? toDatetimeLocalInput(initialValues.startsAt) : "",
            finishesAt: initialValues?.finishesAt ? toDatetimeLocalInput(initialValues.finishesAt) : "",
            placeCode: initialValues?.placeCode ?? "",
            description: initialValues?.description ?? "",
        },
        mode: "onTouched",
    });

    const startsAt = watch("startsAt");
    const finishesAt = watch("finishesAt");
    const placeCode = watch("placeCode");

    const datesReady = useMemo(
        () => Boolean(startsAt && finishesAt),
        [startsAt, finishesAt]
    );

    const [placeOptions, setPlaceOptions] = useState<PlaceOption[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    const [placesError, setPlacesError] = useState<string | null>(null);

    useEffect(() => {
        if (!datesReady) {
            if (placeCode) setValue("placeCode", "");
            setPlaceOptions([]);
            setPlacesError(null);
            setLoadingPlaces(false);
            return;
        }

        const s = toBackendLocalDateTime(startsAt);
        const f = toBackendLocalDateTime(finishesAt);

        let cancelled = false;
        const t = setTimeout(async () => {
            try {
                setLoadingPlaces(true);
                setPlacesError(null);

                const places = await placesService.available(s, f);
                if (cancelled) return;

                setPlaceOptions(places.map(toOption));

                if (placeCode && !places.some((p) => p.code === placeCode)) {
                    setValue("placeCode", "");
                }
            } catch (e: any) {
                if (cancelled) return;
                setPlaceOptions([]);
                setPlacesError(e?.message ?? "Failed to load available places");
                setValue("placeCode", "");
            } finally {
                if (!cancelled) setLoadingPlaces(false);
            }
        }, 350);

        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [datesReady, startsAt, finishesAt, placeCode, setValue]);

    const submit: SubmitHandler<EventFormInput> = async (values) => {
        const parsed: EventFormOutput = eventSchema.parse(values);

        const payload: EventUpsertRequest = {
            name: parsed.name,
            startsAt: toBackendLocalDateTime(parsed.startsAt),
            finishesAt: toBackendLocalDateTime(parsed.finishesAt),
            placeCode: parsed.placeCode,
            description: parsed.description?.trim() ? parsed.description : null,
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

            <div className="col-md-3">
                <label className="form-label">Starts at</label>
                <input
                    type="datetime-local"
                    className={`form-control ${errors.startsAt ? "is-invalid" : ""}`}
                    {...register("startsAt")}
                />
                {errors.startsAt && <div className="invalid-feedback">{errors.startsAt.message as string}</div>}
            </div>

            <div className="col-md-3">
                <label className="form-label">Finishes at</label>
                <input
                    type="datetime-local"
                    className={`form-control ${errors.finishesAt ? "is-invalid" : ""}`}
                    {...register("finishesAt")}
                />
                {errors.finishesAt && <div className="invalid-feedback">{errors.finishesAt.message as string}</div>}
            </div>

            <div className="col-md-6">
                <label className="form-label">Place</label>

                <select
                    className={`form-select ${errors.placeCode ? "is-invalid" : ""}`}
                    {...register("placeCode")}
                    disabled={!datesReady || loadingPlaces}
                >
                    <option value="">
                        {!datesReady
                            ? "Fill dates to load available places"
                            : loadingPlaces
                                ? "Loading places..."
                                : placeOptions.length === 0
                                    ? "No available places"
                                    : "Select a place"}
                    </option>

                    {placeOptions.map((p) => (
                        <option key={p.value} value={p.value}>
                            {p.label} ({p.value})
                        </option>
                    ))}
                </select>

                {errors.placeCode && <div className="invalid-feedback">{errors.placeCode.message as string}</div>}
                {placesError && <div className="form-text text-danger">{placesError}</div>}

                <div className="form-text">
                    The dropdown is enabled only after both dates are filled.
                </div>
            </div>

            <div className="col-md-6">
                <label className="form-label">Description (optional)</label>
                <textarea className="form-control" rows={3} {...register("description")} />
            </div>

            <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary" type="submit" disabled={!!submitting}>
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
