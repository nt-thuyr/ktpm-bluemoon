import { LoginResponse } from "../types/api/auth.api";
import { privateApi, publicApi } from "./client";
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await publicApi.post<LoginResponse>("/api/auth/dang-nhap", {
    username,
    password,
  });
  return response.data;
}

// Interface cho đổi mật khẩu
export interface ChangePasswordRequest {
  username: string;
  current_password: string;
  new_password: string;
}

export const changePasswordApi = async (data: ChangePasswordRequest) => {
  // Dùng privateApi để tự động gửi kèm Token trong Header
  const response = await privateApi.post("/api/auth/doi-mat-khau", data);
  return response.data;
};
