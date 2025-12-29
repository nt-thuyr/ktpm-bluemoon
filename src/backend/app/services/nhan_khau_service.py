from ..extensions import db
from ..models.nhan_khau import NhanKhau
from ..models.ho_khau import HoKhau
from ..models.lich_su_ho_khau import LichSuHoKhau  # <--- Import model Lịch Sử
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
        db.session.flush()  # Để lấy ID của nk mới tạo

        # Nếu nhân khẩu mới có Hộ khẩu -> Ghi lịch sử "Chuyển đến" (1)
        if nk.ho_khau_id:
            ls = LichSuHoKhau(
                nhan_khau_id=nk.id,
                ho_khau_id=nk.ho_khau_id,
                loai_thay_doi=1,
                thoi_gian=datetime.now().date()
            )
            db.session.add(ls)

        db.session.commit()
        return nk_schema.dump(nk)
    except IntegrityError:
        db.session.rollback()
        return None
    except Exception:
        db.session.rollback()
        return None


def update_nhankhau(id, data):
    nk = NhanKhau.query.get(id)
    if not nk: return None

    # Lưu lại ho_khau_id cũ để so sánh
    old_ho_khau_id = nk.ho_khau_id

    clean_data = nk_schema.load(data, partial=True)

    has_change = False
    for attr, value in clean_data.items():
        if getattr(nk, attr) != value:
            setattr(nk, attr, value)
            has_change = True

    if has_change:
        try:
            # Kiểm tra sự thay đổi Hộ khẩu
            new_ho_khau_id = clean_data.get("ho_khau_id", old_ho_khau_id)

            # Nếu Hộ khẩu thay đổi (Khác nhau và không phải giữ nguyên None)
            if old_ho_khau_id != new_ho_khau_id:

                # 1. Nếu trước đó có hộ khẩu -> Ghi lịch sử "Chuyển đi" (2) khỏi hộ cũ
                if old_ho_khau_id:
                    ls_out = LichSuHoKhau(
                        nhan_khau_id=nk.id,
                        ho_khau_id=old_ho_khau_id,
                        loai_thay_doi=2,  # Chuyển đi
                        thoi_gian=datetime.now().date()
                    )
                    db.session.add(ls_out)

                # 2. Nếu bây giờ có hộ khẩu mới -> Ghi lịch sử "Chuyển đến" (1) vào hộ mới
                if new_ho_khau_id:
                    ls_in = LichSuHoKhau(
                        nhan_khau_id=nk.id,
                        ho_khau_id=new_ho_khau_id,
                        loai_thay_doi=1,  # Chuyển đến
                        thoi_gian=datetime.now().date()
                    )
                    db.session.add(ls_in)

            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"

    return nk_schema.dump(nk)

def delete_nhankhau(id):
    """
    Thực chất là CHUYỂN ĐI (tách khỏi hộ), không xóa hẳn
    """
    nk = NhanKhau.query.get(id)
    if not nk:
        return False
    
    if nk.quan_he_voi_chu_ho == "Chủ hộ":
        return "is_chu_ho"

    old_ho_khau_id = nk.ho_khau_id

    # ✅ Ghi lịch sử "Chuyển đi"
    if old_ho_khau_id: 
        ls = LichSuHoKhau(
            nhan_khau_id=nk.id,
            ho_khau_id=old_ho_khau_id,
            loai_thay_doi=2,  # Chuyển đi
            thoi_gian=datetime.now().date()
        )
        db.session.add(ls)

    # ✅ Tách khỏi hộ khẩu (không xóa hẳn)
    nk.ho_khau_id = None
    nk.quan_he_voi_chu_ho = None

    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"❌ Lỗi khi chuyển đi: {e}")
        return False