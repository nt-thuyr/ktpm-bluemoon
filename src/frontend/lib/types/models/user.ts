import { UserRole } from "@/lib/mappers/user.mapper";

// 1. User Model (Dữ liệu trả về từ API)
export interface User {
  id: number;
  username: string;
  hoTen: string | null; // BE trả về ho_ten -> map sang hoTen
  vaiTro: UserRole; // BE trả về vai_tro -> map sang vaiTro
  ngayTao: string | null; // BE trả về string datetime
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  vaiTro: UserRole;
  hoTen?: string;
}

// 6. Update User Payload (Admin sửa user)
export interface UpdateUserRequest {
  vaiTro?: UserRole;
  hoTen?: string;
  password?: string; // Admin reset mật khẩu cho user
}
