import {
  mapResidentApiToModel,
  mapResidentModelToApi,
} from "../mappers/resident.mapper";
import {
  CreateResidentRequest,
  ResidentApi,
  UpdateResidentRequest,
} from "../types/api/resident.api";
import { Resident } from "../types/models/resident";
import { privateApi } from "./client";

interface GetResidentsParams {
  keyword?: string;
  householdId?: string;
}

export const residentsApi = {
  // GET
  getResidents: async (params?: GetResidentsParams): Promise<Resident[]> => {
    const res = await privateApi.get<any>("/api/nhan-khau/", { params });
    console.log(">>> [API] Get Residents Raw:", res.data);
    const rawList: ResidentApi[] = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

    return rawList.map(mapResidentApiToModel);
  },

  // Get Detail
  getResidentById: async (id: string | number): Promise<Resident | null> => {
    try {
      const res = await privateApi.get<any>(`/api/nhan-khau/${id}`);
      const rawData: ResidentApi = res.data.data || res.data;
      return mapResidentApiToModel(rawData);
    } catch (error) {
      console.error(`Lỗi lấy chi tiết nhân khẩu ID ${id}:`, error);
      return null;
    }
  },

  //  Create
  createResident: async (data: Partial<Resident>): Promise<Resident> => {
    const payload: CreateResidentRequest = mapResidentModelToApi(
      data
    ) as CreateResidentRequest;
    console.log(">>> [API] Payload Create Resident:", payload);
    const res = await privateApi.post<any>("/api/nhan-khau/", payload);
    const rawData: ResidentApi = res.data.data || res.data;
    return mapResidentApiToModel(rawData);
  },

  //  Update
  updateResident: async (
    id: string | number,
    data: Partial<Resident>
  ): Promise<Resident> => {
    const payload: UpdateResidentRequest = mapResidentModelToApi(data);
    console.log(`>>> [API] Payload Update Resident ${id}:`, payload);
    const res = await privateApi.put<any>(`/api/nhan-khau/${id}`, payload);
    const rawData: ResidentApi = res.data.data || res.data;
    return mapResidentApiToModel(rawData);
  },

  //  Delete
  deleteResident: async (id: string | number): Promise<void> => {
    await privateApi.delete(`/api/nhan-khau/${id}`);
  },
};
