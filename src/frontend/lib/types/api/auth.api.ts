export type UserDTO = {
  id: number;
  username: string;
  ho_ten: string | null;
  vai_tro: string;
  ngay_tao: string | null;
};

export type LoginResponseDTO = {
  user: UserDTO;
  token: string; // nếu có JWT
};

export interface LoginResponse {
  access_token: string;
  profile: {
    id: number;
    username: string;
    vai_tro: string;
    ho_ten: string;
    ngay_tao: string;
  };
}
