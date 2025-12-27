from marshmallow import Schema, fields, validate, pre_load, EXCLUDE
from datetime import date

# Schema con để hiển thị thành viên (chỉ dùng để dump output, không cần pre_load phức tạp)
class ThanhVienSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(data_key="id")
    ho_ten = fields.Str(data_key="HoTen")
    cccd = fields.Str(data_key="CCCD")
    quan_he_voi_chu_ho = fields.Str(data_key="QuanHe")


class HoKhauSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    so_ho_khau = fields.Int(dump_only=True, data_key="SoHoKhau")

    so_nha = fields.Str(required=True, data_key="SoNha")
    duong = fields.Str(data_key="Duong", allow_none=True)
    phuong = fields.Str(data_key="Phuong", allow_none=True)
    quan = fields.Str(data_key="Quan", allow_none=True)

    ngay_lam_ho_khau = fields.Date(data_key="NgayLamHoKhau", allow_none=True)

    chu_ho_id = fields.Int(data_key="ChuHoID", allow_none=True)

    # Các trường hiển thị thêm (read-only)
    ten_chu_ho = fields.Function(lambda obj: obj.chu_ho.ho_ten if obj.chu_ho else None, data_key="TenChuHo",
                                 dump_only=True)
    thanh_vien = fields.List(fields.Nested(ThanhVienSchema), attribute="thanh_vien_ho", data_key="ThanhVien",
                             dump_only=True)

    @pre_load
    def normalize_keys(self, data, **kwargs):
        mapping = {
            "SoNha": ["SoNha", "soNha", "so_nha", "dia_chi", "DiaChi"],  # Map cả DiaChi cho trường hợp tách hộ
            "Duong": ["Duong", "duong"],
            "Phuong": ["Phuong", "phuong"],
            "Quan": ["Quan", "quan"],
            "NgayLamHoKhau": ["NgayLamHoKhau", "ngayLamHoKhau", "ngay_lam_ho_khau"],
            "ChuHoID": ["ChuHoID", "chuHoID", "chu_ho_id", "chuHoId", "idChuHoMoi"],  # Map luôn idChuHoMoi cho tách hộ
        }

        normalized_data = data.copy()
        for official_key, aliases in mapping.items():
            for alias in aliases:
                if alias in data:
                    normalized_data[official_key] = data[alias]
                    break
        return normalized_data