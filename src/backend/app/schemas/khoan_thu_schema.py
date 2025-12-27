from marshmallow import Schema, fields, validate, pre_load, EXCLUDE


class KhoanThuSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True, data_key="Id")

    ten_khoan_thu = fields.Str(
        required=True,
        data_key="TenKhoanThu",
        validate=validate.Length(min=1, error="Tên khoản thu không được để trống")
    )

    so_tien = fields.Float(required=True, data_key="SoTien")
    bat_buoc = fields.Bool(required=True, data_key="BatBuoc")
    ghi_chu = fields.Str(data_key="GhiChu", allow_none=True)
    han_nop = fields.Date(allow_none=True, data_key="HanNop")
    ngay_tao = fields.Date(allow_none=True, data_key="NgayTao")
    
    @pre_load
    def normalize_keys(self, data, **kwargs):
        mapping = {
            "TenKhoanThu": ["TenKhoanThu", "tenKhoanThu", "ten_khoan_thu"],
            "SoTien": ["SoTien", "soTien", "so_tien"],
            "BatBuoc": ["BatBuoc", "batBuoc", "bat_buoc"],
            "GhiChu": ["GhiChu", "ghiChu", "ghi_chu"],
            "HanNop": ["HanNop", "hanNop", "han_nop"],
        }

        normalized_data = data.copy()
        for official_key, aliases in mapping.items():
            for alias in aliases:
                if alias in data:
                    normalized_data[official_key] = data[alias]
                    break
        return normalized_data