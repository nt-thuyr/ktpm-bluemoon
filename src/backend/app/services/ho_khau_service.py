from ..extensions import db
from ..models.ho_khau import HoKhau
from ..models.nhan_khau import NhanKhau
from ..models.lich_su_ho_khau import LichSuHoKhau
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from datetime import datetime


def parse_date(date_str):
    if not date_str: return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return None


def serialize_hokhau(hk: HoKhau):
    ten_chu_ho = hk.chu_ho.ho_ten if hk.chu_ho else None
    ds_thanh_vien = []
    if hk.thanh_vien_ho:
        for tv in hk.thanh_vien_ho:
            ds_thanh_vien.append({
                "id": tv.id,
                "HoTen": tv.ho_ten,
                "CCCD": tv.cccd,
                "QuanHe": tv.quan_he_voi_chu_ho
            })

    return {
        "SoHoKhau": hk.so_ho_khau,
        "SoNha": hk.so_nha,
        "Duong": hk.duong,
        "Phuong": hk.phuong,
        "Quan": hk.quan,
        "NgayLamHoKhau": str(hk.ngay_lam_ho_khau) if hk.ngay_lam_ho_khau else None,
        "ChuHoID": hk.chu_ho_id,
        "TenChuHo": ten_chu_ho,
        "ThanhVien": ds_thanh_vien
    }


def get_all_hokhau():
    rows = HoKhau.query.all()
    return [serialize_hokhau(r) for r in rows]


def get_hokhau_by_id(id):
    r = HoKhau.query.get(id)
    return serialize_hokhau(r) if r else None


def search_hokhau_global(keyword):
    """
    Tìm kiếm trên nhiều cột cùng lúc với 1 từ khóa duy nhất (Global Search)
    Input: "1206" -> Tìm thấy hộ ở phòng 1206
    Input: "Tuấn" -> Tìm thấy hộ có chủ hộ tên Tuấn
    """
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
            HoKhau.so_nha.ilike(search_pattern),       # Tìm theo số phòng
            NhanKhau.ho_ten.ilike(search_pattern),     # Tìm theo tên chủ hộ
            NhanKhau.cccd.ilike(search_pattern)        # Tìm theo CCCD chủ hộ
        )
    )

    rows = query.all()
    return [serialize_hokhau(r) for r in rows]


def create_hokhau(data):
    try:
        chu_ho_id = data.get("ChuHoID")
        chu_ho = NhanKhau.query.get(chu_ho_id)
        if not chu_ho: return "chu_ho_not_found"

        hk = HoKhau(
            so_nha=data.get("SoNha"),
            duong=data.get("Duong"),
            phuong=data.get("Phuong"),
            quan=data.get("Quan"),
            ngay_lam_ho_khau=parse_date(data.get("NgayLamHoKhau")) or datetime.now().date(),
            chu_ho_id=chu_ho_id
        )
        db.session.add(hk)
        db.session.flush()

        # Setup chủ hộ
        chu_ho.ho_khau_id = hk.so_ho_khau
        chu_ho.quan_he_voi_chu_ho = "Chủ hộ"

        ls = LichSuHoKhau(
            nhan_khau_id=chu_ho_id,
            ho_khau_id=hk.so_ho_khau,
            loai_thay_doi=1,    # 1: thêm mới/chuyển đến
            thoi_gian=datetime.now().date()
        )
        db.session.add(ls)
        db.session.commit()
        return serialize_hokhau(hk)
    except IntegrityError:
        db.session.rollback()
        return None


def update_hokhau(id, data):
    hk = HoKhau.query.get(id)
    if not hk: return None

    # Xử lý thay đổi Chủ Hộ
    new_chu_ho_id = data.get("ChuHoID")
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

            # TODO: Có thể thêm logic ghi Lịch Sử ở đây nếu cần thiết

    # Update các field thông thường
    allowed_fields = ["SoNha", "Duong", "Phuong", "Quan"]
    for k in allowed_fields:
        if k in data:
            setattr(hk, k.lower().replace("so", "so_"), data[k])

    if "NgayLamHoKhau" in data:
        hk.ngay_lam_ho_khau = parse_date(data["NgayLamHoKhau"])

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return "conflict"

    return serialize_hokhau(hk)


def tach_hokhau(data):
    try:
        chu_ho_moi_id = data.get("idChuHoMoi")
        hk_moi = HoKhau(
            so_nha=data.get("DiaChiMoi"),
            duong=data.get("Duong"),
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
        return serialize_hokhau(hk_moi)
    except Exception as e:
        db.session.rollback()
        return None


def delete_hokhau(id):
    hk = HoKhau.query.get(id)
    if not hk: return False

    # Check còn thành viên không?
    count_members = NhanKhau.query.filter_by(ho_khau_id=id).count()
    if count_members > 0:
        return "has_members"  # Frontend cần xử lý lỗi này (báo phải tách hộ hết trước)

    db.session.delete(hk)
    db.session.commit()
    return True