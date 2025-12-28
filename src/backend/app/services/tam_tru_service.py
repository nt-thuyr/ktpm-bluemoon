from ..extensions import db
from ..models.tam_tru_tam_vang import TamTruTamVang
from ..models.nhan_khau import NhanKhau
from datetime import datetime


def serialize_tamtru(tt, ten_nhan_khau=None, cccd=None):
    return {
        "id": tt.id,
        "NhanKhauID": tt.nhan_khau_id,
        "HoTen": ten_nhan_khau,  # Field join từ bảng NhanKhau
        "CCCD": cccd,
        "DiaChi": tt.dia_chi,
        "NoiDungDeNghi": tt.noi_dung_de_nghi,
        "TrangThai": tt.trang_thai,  # "Tạm trú" hoặc "Tạm vắng"
        "ThoiGian": str(tt.thoi_gian) if tt.thoi_gian else None
    }
    

def get_all_tamtru_global(keyword=None):
    """
    Lấy danh sách có hỗ trợ tìm kiếm theo Tên hoặc CCCD
    """
    query = db.session.query(TamTruTamVang, NhanKhau).join(
        NhanKhau, TamTruTamVang.nhan_khau_id == NhanKhau.id
    )

    if keyword:
        search = f"%{keyword}%"
        # Tìm theo Tên người, CCCD hoặc loại Trạng thái
        query = query.filter(
            (NhanKhau.ho_ten.ilike(search)) |
            (NhanKhau.cccd.ilike(search)) |
            (TamTruTamVang.trang_thai.ilike(search))
        )

    results = query.all()
    # results là list các tuple [(TamTruTamVang, NhanKhau), ...]
    return [serialize_tamtru(tt, nk.ho_ten, nk.cccd) for tt, nk in results]


def create_tamtru(data):
    # 1. Validate nhân khẩu
    nk_id = data.get("nhan_khau_id")
    nk = NhanKhau.query.get(nk_id)
    if not nk: return "nhan_khau_not_found"

    # 2. Logic nghiệp vụ
    loai_hinh = data.get("trang_thai")  # "Tạm trú" / "Tạm vắng"

    # Nếu là Tạm vắng -> Người này phải đang thuộc một hộ khẩu nào đó trong chung cư
    if loai_hinh == "Tạm vắng" and not nk.ho_khau_id:
        return "tam_vang_requires_hokhau"

    # 3. Parse ngày
    try:
        ngay_dang_ky = datetime.strptime(data.get("thoi_gian"), '%Y-%m-%d').date()
    except:
        return "invalid_date"

    tt = TamTruTamVang(
        nhan_khau_id=nk_id,
        trang_thai=loai_hinh,
        dia_chi=data.get("dia_chi"),  # Nơi chuyển đến (nếu tạm vắng) hoặc Nơi ở hiện tại (nếu tạm trú)
        thoi_gian=ngay_dang_ky,
        noi_dung_de_nghi=data.get("noi_dung_de_nghi")
    )

    try:
        db.session.add(tt)
        db.session.commit()
        return serialize_tamtru(tt, nk.ho_ten, nk.cccd)
    except Exception:
        db.session.rollback()
        return None

def update_tamtru(id, data):
    tt = TamTruTamVang.query.get(id)
    if not tt: return None
    # --- CHỈ CHO PHÉP SỬA THÔNG TIN CHI TIẾT ---
    if "dia_chi" in data:
        tt.dia_chi = data["dia_chi"]

    if "noi_dung_de_nghi" in data:
        tt.noi_dung_de_nghi = data["noi_dung_de_nghi"]

    if "thoi_gian" in data:
        try:
            tt.thoi_gian = datetime.strptime(data["thoi_gian"], '%Y-%m-%d').date()
        except ValueError:
            return "invalid_date"
    # --- KHÔNG CHO PHÉP SỬA 'nhan_khau_id' HOẶC 'trang_thai' ---
    try:
        db.session.commit()
        nk = NhanKhau.query.get(tt.nhan_khau_id)
        return serialize_tamtru(tt, nk.ho_ten if nk else None, nk.cccd if nk else None)
    except Exception:
        db.session.rollback()
        return "conflict"

def delete_tamtru(id):
    tt = TamTruTamVang.query.get(id)
    if not tt: return False
    db.session.delete(tt)
    db.session.commit()
    return True