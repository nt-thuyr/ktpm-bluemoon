from marshmallow import Schema, fields, validate, pre_load, EXCLUDE
from datetime import date


class NopTienSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True, data_key="Id")

    ho_khau_id = fields.Int(required=True, data_key="HoKhauId")
    khoan_thu_id = fields.Int(required=True, data_key="KhoanThuId")
    ten_khoan_thu = fields.Str(dump_only=True, data_key="TenKhoanThu")
    so_tien = fields.Float(required=True, data_key="SoTien")

    ngay_nop = fields.Date(load_default=date.today, data_key="NgayNop")

    nguoi_nop = fields.Str(allow_none=True, data_key="NguoiNop")

    @pre_load
    def normalize_keys(self, data, **kwargs):
        mapping = {
            "HoKhauId": ["HoKhauId", "ho_khau_id", "hoKhauId", "hoKhauID"],
            "KhoanThuId": ["KhoanThuId", "khoan_thu_id", "khoanThuId", "khoanThuID"],
            "SoTien": ["SoTien", "so_tien", "soTien"],
            "NgayNop": ["NgayNop", "ngay_nop", "ngayNop"],
            "NguoiNop": ["NguoiNop", "nguoi_nop", "nguoiNop"],
            "TenKhoanThu": ["TenKhoanThu", "ten_khoan_thu", "tenKhoanThu"],
        }

        normalized_data = data.copy()
        for official_key, aliases in mapping.items():
            for alias in aliases:
                if alias in data:
                    normalized_data[official_key] = data[alias]
                    break
        return normalized_data