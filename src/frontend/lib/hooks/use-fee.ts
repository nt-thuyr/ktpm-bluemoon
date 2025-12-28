import { CreateFeeRequest, feeApi, UpdateFeeRequest } from "@/lib/services/fee";
import { Fee } from "@/lib/types/models/fee";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export const useFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // FETCH LIST
  const fetchFees = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await feeApi.getFees();
      console.log("useFees rendered");
      setFees(data);
    } catch (error) {
      console.error("Lỗi tải danh sách khoản thu:", error);
      setIsError(true);
      toast.error("Không thể tải danh sách khoản thu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // CREATE
  const addFee = useCallback(async (data: CreateFeeRequest) => {
    try {
      const newFee = await feeApi.createFee(data);
      setFees((prev) => [newFee, ...prev]);
      toast.success(`Đã thêm khoản thu: ${newFee.tenKhoanThu}`);
      return true;
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "";
      if (msg.includes("conflict")) {
        toast.error("Lỗi: Khoản thu này đã tồn tại (trùng tên/mã)!");
      } else if (msg.includes("invalid")) {
        toast.error("Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
      } else {
        toast.error("Thêm khoản thu thất bại. Vui lòng thử lại.");
      }
      return false;
    }
  }, []);

  // UPDATE
  const updateFee = useCallback(async (id: number, data: UpdateFeeRequest) => {
    try {
      const updatedFee = await feeApi.updateFee(id, data);
      setFees((prev) =>
        prev.map((item) => (item.id === id ? updatedFee : item))
      );
      toast.success("Cập nhật khoản thu thành công");
      return true;
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "";
      if (msg.includes("conflict")) {
        toast.error("Tên khoản thu bị trùng với khoản khác!");
      } else {
        toast.error("Cập nhật thất bại");
      }
      return false;
    }
  }, []);

  // DELETE
  const deleteFee = useCallback(async (id: number) => {
    const previousData = [...fees];
    try {
      setFees((prev) => prev.filter((item) => item.id !== id));

      await feeApi.deleteFee(id);
      toast.success("Đã xóa khoản thu");
    } catch (error: any) {
      // Nếu lỗi, khôi phục lại dữ liệu cũ
      setFees(previousData);
      console.error(error);
      const msg = error.message || "";

      if (msg.includes("has_payment")) {
        toast.error("Không thể xóa: Đã có cư dân đóng tiền cho khoản này!");
      } else {
        toast.error("Xóa thất bại. Vui lòng thử lại sau.");
      }
    }
  }, []);

  // SEARCH
  const filteredFees = useMemo(() => {
    if (!searchQuery.trim()) return fees;

    const query = searchQuery.toLowerCase();
    return fees.filter((fee) => {
      return (
        fee.tenKhoanThu?.toLowerCase().includes(query) ||
        fee.id?.toString().includes(query)
      );
    });
  }, [fees, searchQuery]);

  return {
    fees: filteredFees,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    fetchFees,
    addFee,
    updateFee,
    deleteFee,
  };
};
