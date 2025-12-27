from marshmallow import Schema, fields, EXCLUDE

class LichSuHoKhauSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    id = fields.Int(dump_only=True, data_key="Id")

    nhan_khau_id = fields.Int(data_key="NhanKhauID")
    ho_khau_id = fields.Int(data_key="HoKhauID")

    ten_nhan_khau = fields.Function(
        lambda obj: obj.nhan_khau.ho_ten if obj.nhan_khau else "Người đã bị xóa",
        data_key="TenNhanKhau",
        dump_only=True
    )

    # Hiển thị loại thay đổi (1 - chuyển đến, 2 - chuyển đi)
    loai_thay_doi = fields.Int(data_key="LoaiThayDoi")
    mo_ta_thay_doi = fields.Function(
        lambda obj: "Chuyển đến" if obj.loai_thay_doi == 1 else "Chuyển đi",
        data_key="MoTaThayDoi",
        dump_only=True
    )

    thoi_gian = fields.Date(data_key="ThoiGian")