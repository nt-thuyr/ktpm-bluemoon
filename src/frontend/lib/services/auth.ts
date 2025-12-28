import {
  AuthResponse,
  mapAuthResponseToUI,
  mapEnumToBackendRole,
  mapUserToUI,
  User,
} from "../mappers/user.mapper";
import { CreateUserRequest } from "../types/models/user";
import { privateApi, publicApi } from "./client";

const AUTH_URL = "/api/auth";
export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  // Đăng nhập
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const res = await publicApi.post(`${AUTH_URL}/dang-nhap`, payload);
    return mapAuthResponseToUI(res.data);
  },

  // Đổi mật khẩu
  changePassword: async (payload: ChangePasswordRequest) => {
    const backendPayload = {
      mat_khau_hien_tai: payload.currentPassword,
      mat_khau_moi: payload.newPassword,
    };
    const res = await privateApi.post(
      `${AUTH_URL}/doi-mat-khau`,
      backendPayload
    );
    return res.data;
  },
  createUser: async (payload: CreateUserRequest): Promise<User> => {
    const bePayload = {
      username: payload.username,
      password: payload.password,
      ho_ten: payload.hoTen,

      // QUAN TRỌNG: Map "to_truong" -> "Tổ trưởng" để BE hiểu
      vai_tro: mapEnumToBackendRole(payload.vaiTro),
    };

    // Gọi API POST /api/auth/users
    const res = await privateApi.post(`${AUTH_URL}/users`, bePayload);

    // Map dữ liệu trả về để cập nhật UI ngay
    return mapUserToUI(res.data.data);
  },
  // logout: async () => {
  //   await privateApi.delete(`${AUTH_URL}/dang-xuat`);
  // },
};
