from ..extensions import db
from ..models.ho_khau import HoKhau
from ..models.nhan_khau import NhanKhau
from ..models.lich_su_ho_khau import LichSuHoKhau
from ..schemas.ho_khau_schema import HoKhauSchema
from ..schemas.lich_su_schema import LichSuHoKhauSchema
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# Khởi tạo Schema
hk_schema = HoKhauSchema()
list_hk_schema = HoKhauSchema(many=True)
list_lich_su_schema = LichSuHoKhauSchema(many=True)

def get_all_hokhau():
    rows = HoKhau.query.all()
    return list_hk_schema.dump(rows)


def get_hokhau_by_id(id):
    r = HoKhau.query.get(id)
    return hk_schema.dump(r) if r else None


def search_hokhau_global(keyword):
    if not keyword:
        return get_all_hokhau()

    search_pattern = f"%{keyword}%"

    # 1. Khởi tạo query và Join với bảng NhanKhau để tìm theo tên chủ hộ
    query = db.session.query(HoKhau).join(
        NhanKhau, HoKhau.chu_ho_id == NhanKhau.id
    )

    # 2. Sử dụng OR để quét trên nhiều trường
    query = query.filter(
        or_(
            HoKhau.so_nha.ilike(search_pattern),  # Tìm theo số phòng
            NhanKhau.ho_ten.ilike(search_pattern),  # Tìm theo tên chủ hộ
            NhanKhau.cccd.ilike(search_pattern)  # Tìm theo CCCD chủ hộ
        )
    )

    rows = query.all()
    return list_hk_schema.dump(rows)


def create_hokhau(data):
    try:
        clean_data = hk_schema.load(data)

        chu_ho_id = clean_data.get("chu_ho_id")
        chu_ho = NhanKhau.query.get(chu_ho_id)
        if not chu_ho: return "chu_ho_not_found"

        # Nếu không gửi ngày làm hộ khẩu -> lấy ngày hiện tại
        if not clean_data.get("ngay_lam_ho_khau"):
            clean_data["ngay_lam_ho_khau"] = datetime.now().date()

        hk = HoKhau(**clean_data)
        db.session.add(hk)
        db.session.flush()

        # Setup chủ hộ
        chu_ho.ho_khau_id = hk.so_ho_khau
        chu_ho.quan_he_voi_chu_ho = "Chủ hộ"

        ls = LichSuHoKhau(
            nhan_khau_id=chu_ho_id,
            ho_khau_id=hk.so_ho_khau,
            loai_thay_doi=1,  # 1: thêm mới/chuyển đến
            thoi_gian=datetime.now().date()
        )
        db.session.add(ls)
        db.session.commit()
        return hk_schema.dump(hk)
    except IntegrityError:
        db.session.rollback()
        return None


def update_hokhau(id, data):
    hk = HoKhau.query.get(id)
    if not hk: return None

    clean_data = hk_schema.load(data, partial=True)

    # Xử lý thay đổi Chủ Hộ
    new_chu_ho_id = clean_data.get("chu_ho_id")
    if new_chu_ho_id and new_chu_ho_id != hk.chu_ho_id:
        old_chu_ho = NhanKhau.query.get(hk.chu_ho_id)
        new_chu_ho = NhanKhau.query.get(new_chu_ho_id)

        if new_chu_ho:
            # 1. Hạ chủ hộ cũ xuống làm thành viên
            if old_chu_ho:
                old_chu_ho.quan_he_voi_chu_ho = "Thành viên"

            # 2. Đưa người mới lên làm chủ hộ
            new_chu_ho.ho_khau_id = hk.so_ho_khau  # Đảm bảo thuộc hộ này
            new_chu_ho.quan_he_voi_chu_ho = "Chủ hộ"
            hk.chu_ho_id = new_chu_ho.id

    for attr, value in clean_data.items():
        if attr != "chu_ho_id" and getattr(hk, attr) != value:
            setattr(hk, attr, value)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return "conflict"

    return hk_schema.dump(hk)


def tach_hokhau(data):
    try:
        chu_ho_moi_id = data.get("idChuHoMoi")
        hk_moi = HoKhau(
            so_nha=data.get("DiaChiMoi"),
            # duong=data.get("Duong"),
            ngay_lam_ho_khau=datetime.now().date(),
            chu_ho_id=chu_ho_moi_id
        )
        db.session.add(hk_moi)
        db.session.flush()

        ds_thanh_vien_ids = data.get("dsThanhVienSangHoMoi", [])
        if chu_ho_moi_id not in ds_thanh_vien_ids:
            ds_thanh_vien_ids.append(chu_ho_moi_id)

        for nk_id in ds_thanh_vien_ids:
            nk = NhanKhau.query.get(nk_id)
            if nk:
                if nk.ho_khau_id:
                    ls_ra = LichSuHoKhau(nhan_khau_id=nk.id, ho_khau_id=nk.ho_khau_id, loai_thay_doi=2,
                                        thoi_gian=datetime.now().date())
                    db.session.add(ls_ra)

                nk.ho_khau_id = hk_moi.so_ho_khau
                nk.quan_he_voi_chu_ho = "Chủ hộ" if nk.id == chu_ho_moi_id else "Thành viên"

                ls_vao = LichSuHoKhau(nhan_khau_id=nk.id, ho_khau_id=hk_moi.so_ho_khau, loai_thay_doi=1,
                                    thoi_gian=datetime.now().date())
                db.session.add(ls_vao)

        db.session.commit()
        return hk_schema.dump(hk_moi)
    except Exception as e:
        db.session.rollback()
        return None


def delete_hokhau(id):
    hk = HoKhau.query.get(id)
    if not hk: return False

    # Check còn thành viên không?
    count_members = NhanKhau.query.filter_by(ho_khau_id=id).count()
    if count_members > 0:
        return "has_members"

    db.session.delete(hk)
    db.session.commit()
    return True

def get_lich_su_ho_khau(ho_khau_id):
    """
    Lấy danh sách lịch sử thay đổi của một hộ khẩu cụ thể
    """
    # 1. Kiểm tra hộ khẩu có tồn tại không
    hk = HoKhau.query.get(ho_khau_id)
    if not hk:
        return None

    # 2. Query bảng lịch sử, lọc theo ho_khau_id, sắp xếp mới nhất lên đầu
    rows = LichSuHoKhau.query \
        .filter_by(ho_khau_id=ho_khau_id) \
        .order_by(LichSuHoKhau.thoi_gian.desc()) \
        .all()

    # 3. Dump data ra JSON
    return list_lich_su_schema.dump(rows)