from ..extensions import db
from ..models.nhan_khau import NhanKhau
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# Helper: Convert string 'YYYY-MM-DD' -> Python Date object
def parse_date(date_str):
    if not date_str: return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError: return None


def serialize_nhankhau(nk: NhanKhau):
    return {
        "id": nk.id,
        "HoTen": nk.ho_ten,
        "NgaySinh": str(nk.ngay_sinh) if nk.ngay_sinh else None,
        "GioiTinh": nk.gioi_tinh,
        "DanToc": nk.dan_toc,
        "TonGiao": nk.ton_giao,
        "cccd": nk.cccd,
        "NgayCap": str(nk.ngay_cap) if nk.ngay_cap else None,
        "NoiCap": nk.noi_cap,
        "NgheNghiep": nk.nghe_nghiep,
        "GhiChu": nk.ghi_chu,

        # [NEW] Trả về thông tin quan hệ với Hộ khẩu
        "HoKhauID": nk.ho_khau_id,
        "QuanHeVoiChuHo": nk.quan_he_voi_chu_ho,
        "NgayThemNhanKhau": str(nk.ngay_them_nhan_khau) if nk.ngay_them_nhan_khau else None
    }


def get_all_nhankhau():
    rows = NhanKhau.query.all()
    return [serialize_nhankhau(r) for r in rows]


def get_nhankhau_by_id(id):
    r = NhanKhau.query.get(id)
    return serialize_nhankhau(r) if r else None


def create_nhankhau(data):
    try:
        # [NEW] Xử lý convert ngày tháng từ String JSON -> Python Date
        ngay_sinh = parse_date(data.get("NgaySinh"))
        ngay_cap = parse_date(data.get("NgayCap"))
        ngay_them = parse_date(data.get("NgayThemNhanKhau")) or datetime.now().date()

        nk = NhanKhau(
            ho_ten=data.get("HoTen"),
            ngay_sinh=ngay_sinh,
            gioi_tinh=data.get("GioiTinh"),
            dan_toc=data.get("DanToc"),
            ton_giao=data.get("TonGiao"),
            cccd=data.get("cccd"),
            ngay_cap=ngay_cap,
            noi_cap=data.get("NoiCap"),
            nghe_nghiep=data.get("NgheNghiep"),
            ghi_chu=data.get("GhiChu"),

            # [NEW] Mapping quan hệ 1-N ngay khi tạo
            ho_khau_id=data.get("HoKhauID"),
            quan_he_voi_chu_ho=data.get("QuanHeVoiChuHo"),
            ngay_them_nhan_khau=ngay_them
        )
        db.session.add(nk)
        db.session.commit()
        return serialize_nhankhau(nk)
    except IntegrityError:
        db.session.rollback()
        return None


def update_nhankhau(id, data):
    nk = NhanKhau.query.get(id)
    if not nk:
        return None

    # Danh sách trường cho phép update (Mapping JSON key -> Model attr)
    field_map = {
        "HoTen": "ho_ten",
        "GioiTinh": "gioi_tinh",
        "DanToc": "dan_toc",
        "TonGiao": "ton_giao",
        "cccd": "cccd",
        "NoiCap": "noi_cap",
        "NgheNghiep": "nghe_nghiep",
        "GhiChu": "ghi_chu",
        "QuanHeVoiChuHo": "quan_he_voi_chu_ho",
        "HoKhauID": "ho_khau_id"
    }

    has_change = False

    # Update các trường string thông thường
    for json_key, model_attr in field_map.items():
        if json_key in data:
            setattr(nk, model_attr, data[json_key])
            has_change = True

    # [NEW] Update các trường Date riêng biệt
    if "NgaySinh" in data:
        nk.ngay_sinh = parse_date(data["NgaySinh"])
        has_change = True
    if "NgayCap" in data:
        nk.ngay_cap = parse_date(data["NgayCap"])
        has_change = True

    if has_change:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"

    return serialize_nhankhau(nk)


def delete_nhankhau(id):
    nk = NhanKhau.query.get(id)
    if nk:
        # [Todo] Logic: Nếu là Chủ hộ thì không cho xóa, bắt phải tách hộ trước?
        # Tạm thời xóa cứng
        db.session.delete(nk)
        db.session.commit()
        return True
    return False