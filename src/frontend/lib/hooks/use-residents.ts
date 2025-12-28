import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { absenceApi } from "../services/absence";
import { residentsApi } from "../services/residents";
import {
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
} from "../types/api/absence-registration.api";
import { AbsenceRegistration } from "../types/models/absence-registration";
import { Resident } from "../types/models/resident";
import { useDebounce } from "./use-debounce";

// --- Hook Quản lý Nhân Khẩu ---
export function useResidents(params?: {
  keyword?: string;
  householdId?: string;
}) {
  const { householdId, keyword: initialKeyword } = params || {};

  // State tìm kiếm
  const [searchQuery, setSearchQuery] = useState(initialKeyword || "");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // State dữ liệu
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Loading states cho action
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 1. Fetch Danh sách
  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const data = await residentsApi.getResidents({
        householdId,
        keyword: debouncedSearch,
      });

      setResidents(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cư dân:", error);
      setIsError(true);
      toast.error("Không thể tải danh sách cư dân");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, householdId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 2. Create Action
  const createResident = async (data: Partial<Resident>) => {
    try {
      setCreateLoading(true);
      const newResident = await residentsApi.createResident(data);

      // Optimistic Update: Thêm vào đầu danh sách
      setResidents((prev) => [newResident, ...prev]);

      toast.success("Thêm cư dân thành công");
      return true; // Trả về true báo thành công
    } catch (error) {
      console.error(error);
      toast.error("Thêm cư dân thất bại");
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  // 3. Update Action
  const updateResident = async (id: string, data: Partial<Resident>) => {
    try {
      setUpdateLoading(true);

      // Optimistic Update UI trước
      setResidents((prev) =>
        prev.map((item) => {
          if (String(item.id) === id) {
            // Merge data cũ với data mới
            return { ...item, ...data } as Resident;
          }
          return item;
        })
      );

      // Gọi API sau
      await residentsApi.updateResident(id, data);

      toast.success("Cập nhật cư dân thành công");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật cư dân thất bại");
      fetchList(); // Rollback dữ liệu nếu lỗi
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  // 4. Delete Action
  const deleteResident = async (id: string) => {
    try {
      setDeleteLoading(true);

      // UI Update trước
      setResidents((prev) => prev.filter((r) => String(r.id) !== id));

      await residentsApi.deleteResident(id);

      toast.success("Xóa cư dân thành công");
    } catch (error) {
      console.error(error);
      toast.error("Xóa cư dân thất bại");
      fetchList(); // Rollback
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    residents,
    isLoading,
    isError,

    searchQuery,
    setSearchQuery,

    createResident,
    isCreating: createLoading,

    updateResident,
    isUpdating: updateLoading,

    deleteResident,
    isDeleting: deleteLoading,

    refetch: fetchList,
  };
}

// Hook quản lý danh sách tam tru tam vang

export function useAbsence(params?: { keyword?: string }) {
  const { keyword: initialKeyword } = params || {};

  const [searchQuery, setSearchQuery] = useState(initialKeyword || "");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [registrations, setRegistrations] = useState<AbsenceRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Danh sách
  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const data = await absenceApi.getAll({
        keyword: debouncedSearch,
      });

      setRegistrations(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tạm trú/tạm vắng:", error);
      setIsError(true);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Create
  const createRegistration = async (payload: CreateRegistrationRequest) => {
    try {
      setCreateLoading(true);

      const newItem = await absenceApi.create(payload);

      setRegistrations((prev) => [newItem, ...prev]);

      toast.success("Đăng ký thành công");
      return newItem;
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "Đăng ký thất bại";
      toast.error(msg);
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  // Update
  const updateRegistration = async (
    id: number,
    payload: UpdateRegistrationRequest
  ) => {
    try {
      setUpdateLoading(true);
      const updatedItem = await absenceApi.update(id, payload);
      setRegistrations((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return updatedItem;
          }
          return item;
        })
      );

      toast.success("Cập nhật thông tin thành công");
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "Cập nhật thất bại";
      toast.error(msg);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete
  const deleteRegistration = async (id: number) => {
    try {
      setDeleteLoading(true);
      const previousData = [...registrations];
      setRegistrations((prev) => prev.filter((r) => r.id !== id));

      try {
        await absenceApi.delete(id);
        console.log("Đã xóa bản ghi ID:", id);
        toast.success("Xóa bản ghi thành công");
      } catch (err) {
        setRegistrations(previousData);
        throw err;
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    // Data & Status
    registrations,
    isLoading,
    isError,

    // Search
    searchQuery,
    setSearchQuery,

    // Actions
    createRegistration,
    isCreating: createLoading,

    updateRegistration,
    isUpdating: updateLoading,

    deleteRegistration,
    isDeleting: deleteLoading,

    // Utilities
    refetch: fetchList,
  };
}
