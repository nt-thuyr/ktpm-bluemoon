// hooks/use-households.ts
import { householdApi } from "@/lib/services/households";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner"; // Hoặc thư viện toast bạn đang dùng
import { mapHouseholdModelToApi } from "../mappers/household.mapper";
import {
  CreateHouseholdRequest,
  SplitHouseholdRequest,
} from "../types/api/household.api";
import { Household } from "../types/models/household";

export const useHouseholds = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //  FETCH LIST
  const fetchHouseholds = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await householdApi.getHouseholds();
      setHouseholds(data);
    } catch (error) {
      console.error("Lỗi tải danh sách hộ khẩu:", error);
      setIsError(true);
      toast.error("Không thể tải danh sách hộ khẩu");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  // CREATE (Optimistic Update)
  const addHousehold = useCallback(async (data: CreateHouseholdRequest) => {
    try {
      const newHousehold = await householdApi.createHousehold(data);
      setHouseholds((prev) => [newHousehold, ...prev]);
      toast.success(`Đã thêm hộ khẩu mới: ${newHousehold.id}`);
      return true;
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        toast.error("Xung đột: Nhân khẩu này đã là Chủ hộ của hộ khác!");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Thêm hộ khẩu thất bại. Vui lòng thử lại.");
      }
      return false;
    }
  }, []);

  // UPDATE (Optimistic Update)
  const updateHousehold = async (id: number, data: Partial<Household>) => {
    try {
      const payload = mapHouseholdModelToApi(data);
      const updatedHousehold = await householdApi.updateHousehold(id, payload);
      setHouseholds((prev) =>
        prev.map((item) => (item.id === id ? updatedHousehold : item))
      );

      toast.success("Cập nhật thông tin hộ thành công");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
      return false;
    }
  };

  //  DELETE (Optimistic Update)
  const deleteHousehold = async (id: number) => {
    const previousData = [...households];
    try {
      setHouseholds((prev) => prev.filter((item) => item.id !== id));
      await householdApi.deleteHousehold(id);

      toast.success("Đã xóa hộ khẩu");
    } catch (error: any) {
      setHouseholds(previousData);

      const msg = error?.response?.data?.message || "Xóa thất bại";
      toast.error(msg);
    }
  };

  // TÁCH HỘ (Split)
  const splitHousehold = async (data: SplitHouseholdRequest) => {
    try {
      const newHousehold = await householdApi.splitHousehold(data);

      setHouseholds((prev) => [newHousehold, ...prev]);

      toast.success("Tách hộ thành công");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Tách hộ thất bại");
      return false;
    }
  };

  return {
    households,
    isLoading,
    isError,
    fetchHouseholds,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    splitHousehold,
  };
};
