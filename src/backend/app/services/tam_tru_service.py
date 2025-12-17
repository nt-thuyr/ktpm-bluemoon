from ..extensions import db
from ..models.tam_tru_tam_vang import TamTruTamVang
from ..models.nhan_khau import NhanKhau
from datetime import datetime

def create_tamtru(data):
    # 1. Validate nhân khẩu tồn tại
    nk = NhanKhau.query.get(data.get("nhan_khau_id"))
    if not nk: return "nhan_khau_not_found"

    # 2. Parse ngày tháng
    try:
        ngay_dang_ky = datetime.strptime(data.get("thoi_gian"), '%Y-%m-%d').date()
    except:
        return "invalid_date"

    # 3. Lưu vào DB
    tt = TamTruTamVang(
        nhan_khau_id=data.get("nhan_khau_id"),
        trang_thai=data.get("trang_thai"),
        dia_chi=data.get("dia_chi"),
        thoi_gian=ngay_dang_ky,
        noi_dung_de_nghi=data.get("noi_dung_de_nghi")
    )

    try:
        db.session.add(tt)
        db.session.commit()
        return {
            "id": tt.id,
            "HoTen": nk.ho_ten,
            "TrangThai": tt.trang_thai,
            "NgayDangKy": str(tt.thoi_gian)
        }
    except Exception as e:
        db.session.rollback()
        return None