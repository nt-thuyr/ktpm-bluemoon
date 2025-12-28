export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface FinancialStats {
  cards: {
    tong_doanh_thu: number;
    can_ho_no_phi: number;
  };
  charts: {
    doanh_thu_6_thang: { name: string; total: number }[];
  };
}

export interface PopulationStats {
  cards: {
    tong_cu_dan: number;
  };
  charts: {
    co_cau_dan_cu: ChartData[];
    phan_bo_gioi_tinh: ChartData[];
    phan_bo_do_tuoi: ChartData[];
  };
}

export interface ProcessedPopulationStats {
  tong_cu_dan: number;
  tam_tru: number;
  tam_vang: number;
  thuong_tru: number;
  phan_bo_gioi_tinh: ChartData[];
  phan_bo_do_tuoi: ChartData[];
  co_cau_dan_cu: ChartData[];
}

export function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
