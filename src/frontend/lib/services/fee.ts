// lib/services/fee.ts
import { mapFeeApiToModel } from "@/lib/mappers/fee.mapper";
import { privateApi } from "@/lib/services/client";
import { FeeApi } from "@/lib/types/api/fee.api";
import { Fee } from "@/lib/types/models/fee";

// 1. Định nghĩa các Request Body gửi lên Server
export interface CreateFeeRequest {
  TenKhoanThu: string;
  SoTien: number;
  BatBuoc: boolean;
  GhiChu?: string | null;
  HanNop?: string | null;
}

export interface UpdateFeeRequest extends Partial<CreateFeeRequest> {}

interface FeeDetailResponse {
  data: FeeApi;
  message?: string;
}

export const feeApi = {
  getFees: async (): Promise<Fee[]> => {
    const res = await privateApi.get<any>("/api/khoan-thu/");
    const rawList = res.data;
    if (Array.isArray(rawList)) {
      return rawList.map(mapFeeApiToModel);
    }
    return [];
  },

  // Get Detail
  getFeeById: async (id: number): Promise<Fee | null> => {
    try {
      const response = await privateApi.get(`/api/khoan-thu/${id}`);

      console.log("API Fee Detail Response for ID " + id + ":", response);

      const dataToMap = response.data;

      if (!dataToMap) return null;
      return mapFeeApiToModel(dataToMap);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết khoản thu:", error);
      return null;
    }
  },

  // Create
  createFee: async (data: CreateFeeRequest): Promise<Fee> => {
    const res = await privateApi.post<FeeApi | string>("/api/khoan-thu/", data);

    if (typeof res.data === "string") {
      throw new Error(res.data);
    }
    return mapFeeApiToModel(res.data);
  },

  // Update
  updateFee: async (id: number, data: UpdateFeeRequest): Promise<Fee> => {
    const res = await privateApi.put<FeeApi | string>(
      `/api/khoan-thu/${id}`,
      data
    );

    const rawData = res.data;
    if (typeof rawData === "string") {
      throw new Error(`Lỗi update khoản thu: ${rawData}`);
    }
    if (!rawData || !rawData.TenKhoanThu) {
      throw new Error(
        "Backend trả về dữ liệu rỗng hoặc sai định dạng sau khi update"
      );
    }
    return mapFeeApiToModel(rawData);
  },

  // Delete
  deleteFee: async (id: number): Promise<void> => {
    const res = await privateApi.delete(`/api/khoan-thu/${id}`);
    // Check nếu BE trả về string lỗi (vd: "has_payment")
    if (res.data === "has_payment") {
      throw new Error("Khoản thu này đã có người đóng, không thể xóa!");
    }
  },
};
