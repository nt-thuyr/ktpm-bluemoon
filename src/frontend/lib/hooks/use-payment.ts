import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { paymentApi } from "../services/payment";
import {
  CreatePaymentRequest,
  PaymentHistory,
  PaymentReceipt,
} from "../types/models/payment";

interface UsePaymentParams {
  hoKhauId?: number; // Nếu muốn lọc lịch sử của 1 hộ
  khoanThuId?: number; // Nếu muốn xem lịch sử đóng của 1 khoản phí
}

export function usePayment(params?: UsePaymentParams) {
  const { hoKhauId, khoanThuId } = params || {};
  // --- State Danh sách ---
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // --- State Loading Actions ---
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- State cho chức năng In Hóa Đơn ---
  const [receiptData, setReceiptData] = useState<PaymentReceipt | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  //search
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch List
  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await paymentApi.getAll({ hoKhauId, khoanThuId });
      setPayments(data);
      setIsError(false);
    } catch (error) {
      console.error("Lỗi tải lịch sử nộp tiền:", error);
      setIsError(true);
      toast.error("Không thể tải lịch sử nộp tiền");
    } finally {
      setIsLoading(false);
    }
  }, [hoKhauId, khoanThuId]);

  // Auto fetch khi params đổi
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 2. Create (Thu tiền)
  const createPayment = async (payload: CreatePaymentRequest) => {
    try {
      setCreateLoading(true);
      const newItem = await paymentApi.create(payload);

      // Update UI ngay lập tức (đưa lên đầu danh sách)
      setPayments((prev) => [newItem, ...prev]);

      toast.success("Ghi nhận thu tiền thành công");
      return newItem; // Trả về để form có thể dùng (ví dụ mở modal in ngay sau khi tạo)
    } catch (error) {
      console.error(error);
      toast.error("Ghi nhận thất bại");
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  // 3. Delete
  const deletePayment = async (id: number) => {
    try {
      setDeleteLoading(true);
      // Optimistic update: Xóa trên UI trước
      const backup = [...payments];
      setPayments((prev) => prev.filter((p) => p.id !== id));

      try {
        await paymentApi.delete(id);
        toast.success("Đã xóa bản ghi nộp tiền");
      } catch (err) {
        setPayments(backup); // Rollback nếu lỗi
        throw err;
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    } finally {
      setDeleteLoading(false);
    }
  };

  // search function
  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return payments;

    const query = searchQuery.toLowerCase();
    return payments.filter((p) => {
      return (
        p.nguoiNop?.toLowerCase().includes(query) || // Tìm theo tên người nộp
        p.hoKhauId?.toString().includes(query) || // Tìm theo mã hộ khẩu
        p.id?.toString().includes(query) // Tìm theo mã biên lai
      );
    });
  }, [payments, searchQuery]);

  // 4. Lấy thông tin hóa đơn (Preview PDF)
  const fetchReceipt = async (id: number) => {
    try {
      setReceiptLoading(true);
      const data = await paymentApi.getReceiptDetail(id);
      setReceiptData(data);
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được thông tin hóa đơn");
    } finally {
      setReceiptLoading(false);
    }
  };

  // Clear receipt data (dùng khi đóng modal in)
  const clearReceipt = () => setReceiptData(null);

  return {
    payments: filteredPayments,
    originalPayments: payments,
    isLoading,
    isError,
    refetch: fetchPayments,

    createPayment,
    isCreating: createLoading,

    deletePayment,
    isDeleting: deleteLoading,

    fetchReceipt,
    receiptData,
    clearReceipt,
    isFetchingReceipt: receiptLoading,

    searchQuery,
    setSearchQuery,
  };
}
