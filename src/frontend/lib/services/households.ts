// services/households.ts
import { mapHouseholdApiToModel } from "@/lib/mappers/household.mapper";
import { privateApi } from "@/lib/services/client";
import {
  CreateHouseholdRequest,
  HouseholdApi,
} from "@/lib/types/api/household.api";
import { Household } from "@/lib/types/models/household";

// Định nghĩa kiểu Response trả về từ Server
interface HouseholdListResponse {
  data: HouseholdApi[];
  message: string;
}

interface HouseholdDetailResponse {
  data: HouseholdApi;
  message: string;
}

// ✅ Interface khớp CHÍNH XÁC với backend schema
interface HouseholdHistoryItem {
  Id: number;
  NhanKhauID: number;
  HoKhauID: number;
  TenNhanKhau: string;
  LoaiThayDoi: number;
  MoTaThayDoi: string;
  ThoiGian:  string;
}

export const householdApi = {
  getHouseholds: async (): Promise<Household[]> => {
    const res = await privateApi.get<any>("/api/ho-khau/");
    const rawData = res.data. data;
    return rawData.map(mapHouseholdApiToModel);
  },

  getHouseholdById: async (id: number): Promise<Household | null> => {
    try {
      const response = await privateApi.get(`/api/ho-khau/${id}`);
      console.log("API Response cho ID " + id + ":", response);
      const dataToMap = response.data;
      return mapHouseholdApiToModel(dataToMap);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hộ khẩu:", error);
      return null;
    }
  },

  createHousehold: async (data: CreateHouseholdRequest): Promise<Household> => {
    console.log(">>> [API] Payload Create Household:", data);
    try {
      const res = await privateApi.post<any>("/api/ho-khau/", data);
      console.log(">>> [API] Response Create Household:", res.data);
      const rawData = res.data.data || res.data;
      return mapHouseholdApiToModel(rawData);
    } catch (error:  any) {
      console.error(
        ">>> [API Error] Create failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateHousehold:  async (
    id: number,
    data: Partial<HouseholdApi>
  ): Promise<Household> => {
    const res = await privateApi.put<HouseholdDetailResponse>(
      `/api/ho-khau/${id}`,
      data
    );
    const rawData = res.data?. data || res.data;
    if (!rawData || !rawData.SoHoKhau) {
      throw new Error(
        "Backend trả về dữ liệu rỗng hoặc sai định dạng sau khi update"
      );
    }
    return mapHouseholdApiToModel(rawData);
  },

  deleteHousehold:  async (id: number): Promise<void> => {
    await privateApi.delete(`/api/ho-khau/${id}`);
  },


  getHouseholdHistory: async (householdId: number): Promise<HouseholdHistoryItem[]> => {
    try {
      const res = await privateApi.get(`/api/ho-khau/${householdId}/lich-su`);
      
      // Backend trả về:  { SoHoKhau: 1001, LichSu:  [... ] }
      const historyData = res.data?. LichSu || [];
      
      console.log("✅ History Response:", res.data);
      
      return Array.isArray(historyData) ? historyData : [];
    } catch (error) {
      console.error("❌ Lỗi khi lấy lịch sử:", error);
      return [];
    }
  },
};