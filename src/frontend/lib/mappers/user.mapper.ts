// --- TYPES ---
export type UserRole = "to_truong" | "ke_toan" | "unknown";

export interface User {
  id: number;
  username: string;
  hoTen: string;
  vaiTro: UserRole;
  ngayTao: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

const mapBackendRoleToEnum = (rawRole: string): UserRole => {
  if (rawRole === "Tổ trưởng") return "to_truong";
  if (rawRole === "Kế toán") return "ke_toan";
  return "unknown";
};

// Map User DTO -> User Model
export const mapUserToUI = (dto: any): User => {
  return {
    id: dto.id,
    username: dto.username,
    hoTen: dto.ho_ten || "",
    vaiTro: mapBackendRoleToEnum(dto.vai_tro), // Convert role ở đây
    ngayTao: dto.ngay_tao,
  };
};

export const mapAuthResponseToUI = (dto: any): AuthResponse => {
  return {
    accessToken: dto.access_token,
    user: mapUserToUI(dto.profile),
  };
};

export const mapEnumToBackendRole = (role: UserRole): string => {
  switch (role) {
    case "to_truong":
      return "Tổ trưởng";
    case "ke_toan":
      return "Kế toán";
    default:
      return "Tổ trưởng";
  }
};
