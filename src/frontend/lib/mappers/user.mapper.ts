import { UserDTO } from "../types/api/auth.api";
import { User } from "../types/models/user";
export function mapUserDTO(dto: UserDTO): User {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.ho_ten ?? undefined,
    role: dto.vai_tro,
    createdAt: dto.ngay_tao ? new Date(dto.ngay_tao) : undefined,
  };
}

// Role raw từ backend (KHÔNG đổi)
export const BACKEND_ROLES = {
  TO_TRUONG: "Tổ trưởng",
  KE_TOAN: "Kế toán",
} as const;

// Role chuẩn FE dùng nội bộ
export type AppRole = "to_truong" | "ke_toan";

// Map backend → FE
export function mapBackendRole(role: string): AppRole | null {
  switch (role) {
    case BACKEND_ROLES.TO_TRUONG:
      return "to_truong";
    case BACKEND_ROLES.KE_TOAN:
      return "ke_toan";
    default:
      return null;
  }
}
