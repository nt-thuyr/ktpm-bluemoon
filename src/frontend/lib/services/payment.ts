import { mapPaymentToUI, mapReceiptToUI } from "@/lib/mappers/payment.mapper";
import {
  CreatePaymentRequest,
  PaymentDTO,
  PaymentReceipt,
  PaymentReceiptDTO,
} from "../types/models/payment";
import { privateApi } from "./client";

const BASE_URL = "/api/nop-tien/";

export const paymentApi = {
  // Lấy danh sách lịch sử nộp
  getAll: async (params?: { hoKhauId?: number; khoanThuId?: number }) => {
    const res = await privateApi.get<PaymentDTO[]>(BASE_URL, { params });

    return res.data.map(mapPaymentToUI);
  },

  // Thu tiền (Tạo mới)
  create: async (payload: CreatePaymentRequest) => {
    const res = await privateApi.post<PaymentDTO>(BASE_URL, payload);
    return mapPaymentToUI(res.data);
  },

  // Xóa lịch sử nộp
  delete: async (id: number) => {
    await privateApi.delete(`${BASE_URL}${id}`);
  },

  // Lấy chi tiết để in Hóa đơn/PDF
  getReceiptDetail: async (id: number): Promise<PaymentReceipt> => {
    const res = await privateApi.get<PaymentReceiptDTO>(
      `${BASE_URL}${id}/detail`
    );
    return mapReceiptToUI(res.data);
  },
};
