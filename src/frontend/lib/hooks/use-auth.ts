"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "../mappers/user.mapper";
import { authApi } from "../services/auth";
import { CreateUserRequest } from "../types/models/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Khôi phục session khi reload trang
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("access_token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Lỗi parse user", e);
      sessionStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hàm Login
  const login = async (username: string, password: string) => {
    try {
      const data = await authApi.login({ username, password });
      if (data.user.vaiTro === "unknown") {
        throw new Error("Vai trò người dùng không hợp lệ");
      }
      setUser(data.user);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("access_token", data.accessToken);

      toast.success("Đăng nhập thành công");
      router.push("/"); // Chuyển về Dashboard
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(msg);
      throw error;
    }
  };

  //  Logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    toast.info("Đã đăng xuất");
    router.push("/auth");
  };

  // Hàm Change Password
  const changePassword = async (currentPass: string, newPass: string) => {
    try {
      await authApi.changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
      });
      toast.success("Đổi mật khẩu thành công!");
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi đổi mật khẩu";
      toast.error(msg);
      return false;
    }
  };

  const createUser = async (data: CreateUserRequest) => {
    if (user?.vaiTro !== "to_truong") {
      toast.error("Bạn không có quyền thực hiện chức năng này");
      return false;
    }

    try {
      await authApi.createUser(data);
      toast.success(`Tạo tài khoản ${data.username} thành công`);
      return true;
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Tạo tài khoản thất bại";
      toast.error(msg);
      return false;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    changePassword,
    createUser,
  };
}
