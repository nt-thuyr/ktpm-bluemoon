from ..extensions import db
from ..models.nhan_khau import NhanKhau
from ..models.ho_khau import HoKhau
from ..schemas.nhan_khau_schema import NhanKhauSchema
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
from datetime import datetime

nk_schema = NhanKhauSchema()
list_nk_schema = NhanKhauSchema(many=True)


def get_all_nhankhau():
    rows = NhanKhau.query.all()
    return list_nk_schema.dump(rows)


def get_nhankhau_by_id(id):
    r = NhanKhau.query.get(id)
    return nk_schema.dump(r) if r else None


def search_nhankhau_global(keyword):
    if not keyword:
        return get_all_nhankhau()

    search_pattern = f"%{keyword}%"

    # Join với HoKhau để tìm người theo địa chỉ phòng
    query = db.session.query(NhanKhau).outerjoin(
        HoKhau, NhanKhau.ho_khau_id == HoKhau.so_ho_khau
    )

    query = query.filter(
        or_(
            NhanKhau.ho_ten.ilike(search_pattern),  # Tìm theo tên
            NhanKhau.cccd.ilike(search_pattern),  # Tìm theo CCCD
            HoKhau.so_nha.ilike(search_pattern)  # Tìm theo Số phòng ở
        )
    )

    rows = query.all()
    return list_nk_schema.dump(rows)


def create_nhankhau(data):
    try:
        clean_data = nk_schema.load(data)

        if not clean_data.get("ngay_them_nhan_khau"):
            clean_data["ngay_them_nhan_khau"] = datetime.now().date()

        nk = NhanKhau(**clean_data)
        db.session.add(nk)
        db.session.commit()
        return nk_schema.dump(nk)
    except IntegrityError:
        db.session.rollback()
        return None
    except Exception:  # Bắt lỗi validate schema nếu cần
        return None


def update_nhankhau(id, data):
    nk = NhanKhau.query.get(id)
    if not nk: return None

    # partial=True để update từng phần
    # Schema sẽ lọc các field rác và convert date string -> date object
    clean_data = nk_schema.load(data, partial=True)

    has_change = False
    for attr, value in clean_data.items():
        if getattr(nk, attr) != value:
            setattr(nk, attr, value)
            has_change = True

    if has_change:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"
    return nk_schema.dump(nk)


def delete_nhankhau(id):
    nk = NhanKhau.query.get(id)
    if nk:
        if nk.quan_he_voi_chu_ho == "Chủ hộ":
            return "is_chu_ho"

        db.session.delete(nk)
        db.session.commit()
        return True
    return False