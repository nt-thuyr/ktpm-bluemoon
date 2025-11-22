// Định nghĩa kiểu dữ liệu cho Cư dân
export type Resident = {
  id: string
  name: string       // Họ tên
  apartmentId: string // Số phòng (VD: A101)
  phone: string      // Số điện thoại
  status: "active" | "inactive" // Trạng thái: Đang ở / Đã chuyển đi
  email: string
  joinDate: string   // Ngày dọn vào
}