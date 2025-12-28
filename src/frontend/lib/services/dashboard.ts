import {
  FinancialStats,
  PopulationStats,
  ProcessedPopulationStats,
} from "@/lib/types/models/dashboard";
import { privateApi } from "./client";

export const dashboardService = {
  getManagerStats: async (): Promise<ProcessedPopulationStats> => {
    try {
      const response = await privateApi.get<PopulationStats>(
        "/api/thong-ke/dashboard/dan-cu"
      );
      const data = response.data;

      const coCau = data.charts.co_cau_dan_cu || [];

      return {
        tong_cu_dan: data.cards.tong_cu_dan || 0,
        tam_tru: coCau.find((i) => i.name === "Tạm trú")?.value || 0,
        tam_vang: coCau.find((i) => i.name === "Tạm vắng")?.value || 0,
        thuong_tru: coCau.find((i) => i.name === "Thường trú")?.value || 0,
        phan_bo_gioi_tinh: data.charts.phan_bo_gioi_tinh || [],
        phan_bo_do_tuoi: data.charts.phan_bo_do_tuoi || [],
        co_cau_dan_cu: coCau,
      };
    } catch (error) {
      console.error("Lỗi fetch dashboard:", error);
      throw error;
    }
  },

  getAccountantStats: async (): Promise<FinancialStats> => {
    try {
      const response = await privateApi.get<FinancialStats>(
        "/api/thong-ke/dashboard/tai-chinh"
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi fetch tài chính:", error);
      throw error;
    }
  },
};
