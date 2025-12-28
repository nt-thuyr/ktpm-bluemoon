"use client";

import { mapBackendRole } from "@/lib/mappers/user.mapper";
import { changePasswordApi, loginUser } from "@/lib/services/auth"; // Import thêm
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Import toast để thông báo

export type Role = "to_truong" | "ke_toan";

export interface User {
  id: number;
  username: string;
  vai_tro: Role;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Lỗi parse user", e);
      sessionStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginUser(username, password);
      const role = mapBackendRole(data.profile.vai_tro);
      if (!role) throw new Error("Vai trò không hợp lệ");

      const loggedUser: User = {
        id: data.profile.id,
        username: data.profile.username,
        vai_tro: role,
      };

      setUser(loggedUser);
      sessionStorage.setItem("user", JSON.stringify(loggedUser));
      sessionStorage.setItem("access_token", data.access_token);

      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    toast.info("Đã đăng xuất");
    router.push("/auth");
  };

  // 🔹 Hàm Đổi Mật Khẩu Mới
  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user) return;
    try {
      await changePasswordApi({
        username: user.username,
        current_password: currentPass,
        new_password: newPass,
      });
      toast.success("Đổi mật khẩu thành công!");
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi đổi mật khẩu";
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
  };
}
