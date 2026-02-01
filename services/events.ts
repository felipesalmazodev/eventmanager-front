import { api } from "./api";

export type PlaceAddressDto = {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
};

export type PlaceDetailsDto = {
    name: string;
    code: string;
    cep: string;
    capacity: number;
    number: number;
    complement?: string | null;
    reference?: string | null;
};

export type EventListDto = {
    id: number;
    name: string;
    startsAt: string;
    finishesAt: string;
    description?: string | null;
    place: PlaceDetailsDto;
};

export type EventDetailsDto = {
    id: number;
    name: string;
    startsAt: string;
    finishesAt: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    place: PlaceDetailsDto;
    address?: PlaceAddressDto | null;
};

export type EventUpsertRequest = {
    name: string;
    startsAt: string;
    finishesAt: string;
    placeCode: string;
    description?: string | null;
};

export const eventsService = {
    list: () => api<EventListDto[]>("/api/events"),
    get: (id: number, enrichPlace: boolean) =>
        api<EventDetailsDto>(`/api/events/${id}?enrichPlace=${enrichPlace}`),

    create: (payload: EventUpsertRequest) =>
        api<void>("/api/events/create", { method: "POST", body: JSON.stringify(payload) }),

    update: (id: number, payload: EventUpsertRequest) =>
        api<void>(`/api/events/update/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

    remove: (id: number) =>
        api<void>(`/api/events/delete/${id}`, { method: "DELETE" }),
};
