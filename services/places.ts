import { api } from "./api";

export type PlaceListDto = {
  id: number;
  name: string;
  code: string;
  capacity: number;
  cep: string;
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

export type PlaceUpsertRequest = {
  name: string;
  code: string;
  capacity: number;
  cep: string;
  number: number;
  complement?: string | null;
  reference?: string | null;
};

export const placesService = {
  list: () => api<PlaceListDto[]>("/api/places"),
  get: (id: number) => api<PlaceDetailsDto>(`/api/places/${id}`),
  create: (payload: PlaceUpsertRequest) => api<void>("/api/places/create", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: PlaceUpsertRequest) => api<void>(`/api/places/update/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => api<void>(`/api/places/delete/${id}`, { method: "DELETE" }),
};