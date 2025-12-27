from marshmallow import Schema, fields, validate, pre_load, EXCLUDE

class NhanKhauSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True, data_key="id")

    ho_ten = fields.Str(required=True, data_key="HoTen", validate=validate.Length(min=1))

    ngay_sinh = fields.Date(data_key="NgaySinh", allow_none=True)
    gioi_tinh = fields.Str(data_key="GioiTinh", allow_none=True)
    dan_toc = fields.Str(data_key="DanToc", allow_none=True)
    ton_giao = fields.Str(data_key="TonGiao", allow_none=True)

    cccd = fields.Str(data_key="cccd", allow_none=True)
    ngay_cap = fields.Date(data_key="NgayCap", allow_none=True)
    noi_cap = fields.Str(data_key="NoiCap", allow_none=True)

    nghe_nghiep = fields.Str(data_key="NgheNghiep", allow_none=True)
    ghi_chu = fields.Str(data_key="GhiChu", allow_none=True)

    ho_khau_id = fields.Int(data_key="HoKhauID", allow_none=True)
    quan_he_voi_chu_ho = fields.Str(data_key="QuanHeVoiChuHo", allow_none=True)

    ngay_them_nhan_khau = fields.Date(dump_only=True, data_key="NgayThemNhanKhau")

    @pre_load
    def normalize_keys(self, data, **kwargs):
        mapping = {
            "HoTen": ["HoTen", "hoTen", "ho_ten"],
            "NgaySinh": ["NgaySinh", "ngaySinh", "ngay_sinh"],
            "GioiTinh": ["GioiTinh", "gioiTinh", "gioi_tinh"],
            "DanToc": ["DanToc", "danToc", "dan_toc"],
            "TonGiao": ["TonGiao", "tonGiao", "ton_giao"],
            "cccd": ["CCCD", "cccd"],
            "NgayCap": ["NgayCap", "ngayCap", "ngay_cap"],
            "NoiCap": ["NoiCap", "noiCap", "noi_cap"],
            "NgheNghiep": ["NgheNghiep", "ngheNghiep", "nghe_nghiep"],
            "GhiChu": ["GhiChu", "ghiChu", "ghi_chu"],
            "HoKhauID": ["HoKhauID", "hoKhauID", "ho_khau_id", "hoKhauId"],
            "QuanHeVoiChuHo": ["QuanHeVoiChuHo", "quanHeVoiChuHo", "quan_he_voi_chu_ho"],
        }

        normalized_data = data.copy()
        for official_key, aliases in mapping.items():
            for alias in aliases:
                if alias in data:
                    normalized_data[official_key] = data[alias]
                    break
        return normalized_data