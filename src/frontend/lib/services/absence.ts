import { mapRegistrationResponseToUI } from "../mappers/absence-registration.mapper";
import {
  AbsenceRegistrationDTO,
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
} from "../types/api/absence-registration.api";
import { AbsenceRegistration } from "../types/models/absence-registration";
import { privateApi } from "./client";

interface GetAbsenceParams {
  keyword?: string;
}

export const absenceApi = {
  getAll: async (params?: GetAbsenceParams): Promise<AbsenceRegistration[]> => {
    const res = await privateApi.get<any>("/api/tam-tru/", { params });

    console.log("API Response Raw:", res.data);

    const rawList: AbsenceRegistrationDTO[] = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

    return rawList.map(mapRegistrationResponseToUI);
  },

  // Tạo mới
  create: async (
    payload: CreateRegistrationRequest
  ): Promise<AbsenceRegistration> => {
    console.log(">>> [API] Payload Create Absence:", payload);

    const res = await privateApi.post<any>("/api/tam-tru/", payload);
    const rawData: AbsenceRegistrationDTO = res.data.data || res.data;
    return mapRegistrationResponseToUI(rawData);
  },

  // Cập nhật
  update: async (
    id: number,
    payload: UpdateRegistrationRequest
  ): Promise<AbsenceRegistration> => {
    console.log(`>>> [API] Payload Update Absence ${id}:`, payload);
    const res = await privateApi.put<any>(`/api/tam-tru/${id}`, payload);
    const rawData: AbsenceRegistrationDTO = res.data.data || res.data;

    return mapRegistrationResponseToUI(rawData);
  },

  // Xóa
  delete: async (id: number): Promise<void> => {
    await privateApi.delete(`/api/tam-tru/${id}`);
  },
};
