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
export const householdApi = {
  getHouseholds: async (): Promise<Household[]> => {
    const res = await privateApi.get<any>("/api/ho-khau/");
    // response.data chính là cái cục JSON bạn gửi: { count: 3, data: [...] }
    const rawData = res.data.data;
    return rawData.map(mapHouseholdApiToModel);
  },
  // 2. Get Detail
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

  // 3. Create
  createHousehold: async (data: CreateHouseholdRequest): Promise<Household> => {
    console.log(">>> [API] Payload Create Household:", data);
    try {
      const res = await privateApi.post<any>("/api/ho-khau/", data);
      console.log(">>> [API] Response Create Household:", res.data);
      const rawData = res.data.data || res.data;

      return mapHouseholdApiToModel(rawData);
    } catch (error: any) {
      console.error(
        ">>> [API Error] Create failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 4. Update
  updateHousehold: async (
    id: number,
    data: Partial<HouseholdApi>
  ): Promise<Household> => {
    const res = await privateApi.put<HouseholdDetailResponse>(
      `/api/ho-khau/${id}`,
      data
    );
    const rawData = res.data?.data || res.data;
    if (!rawData || !rawData.SoHoKhau) {
      throw new Error(
        "Backend trả về dữ liệu rỗng hoặc sai định dạng sau khi update"
      );
    }
    return mapHouseholdApiToModel(rawData);
  },

  // 5. Delete
  deleteHousehold: async (id: number): Promise<void> => {
    await privateApi.delete(`/api/ho-khau/${id}`);
  },
};
