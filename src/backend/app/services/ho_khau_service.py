from ..extensions import db
from ..models.ho_khau import HoKhau
from ..models.nhan_khau import NhanKhau
from ..models.lich_su_ho_khau import LichSuHoKhau
from sqlalchemy.exc import IntegrityError
from datetime import datetime


# Helper parse ngày
def parse_date(date_str):
    if not date_str: return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return None


def serialize_hokhau(hk: HoKhau):
    # Lấy thông tin chủ hộ (nếu có)
    ten_chu_ho = hk.chu_ho.ho_ten if hk.chu_ho else None

    # Lấy danh sách thành viên trong hộ
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
        "DienTich": float(hk.dien_tich) if hk.dien_tich else 0.0,  # Quan trọng để tính tiền
        "NgayLamHoKhau": str(hk.ngay_lam_ho_khau) if hk.ngay_lam_ho_khau else None,
        "ChuHoID": hk.chu_ho_id,
        "TenChuHo": ten_chu_ho,
        "ThanhVien": ds_thanh_vien  # Trả về list thành viên để Frontend hiển thị
    }


def get_all_hokhau():
    rows = HoKhau.query.all()
    return [serialize_hokhau(r) for r in rows]


def get_hokhau_by_id(id):  # Sửa lỗi tên hàm cũ
    r = HoKhau.query.get(id)
    return serialize_hokhau(r) if r else None


def create_hokhau(data):
    try:
        # Validate: Chủ hộ phải tồn tại
        chu_ho_id = data.get("ChuHoID")
        chu_ho = NhanKhau.query.get(chu_ho_id)
        if not chu_ho:
            return "chu_ho_not_found"

        hk = HoKhau(
            so_nha=data.get("SoNha"),
            duong=data.get("Duong"),
            phuong=data.get("Phuong"),
            quan=data.get("Quan"),
            dien_tich=data.get("DienTich", 0),  # Mặc định 0 nếu không nhập
            ngay_lam_ho_khau=parse_date(data.get("NgayLamHoKhau")) or datetime.now().date(),
            chu_ho_id=chu_ho_id
        )
        db.session.add(hk)
        db.session.flush()  # Để lấy hk.so_ho_khau ngay lập tức

        # Logic nghiệp vụ: Khi tạo hộ, set ngay Chủ hộ vào hộ này
        chu_ho.ho_khau_id = hk.so_ho_khau
        chu_ho.quan_he_voi_chu_ho = "Chủ hộ"

        # Ghi lịch sử
        ls = LichSuHoKhau(
            nhan_khau_id=chu_ho_id,
            ho_khau_id=hk.so_ho_khau,
            loai_thay_doi=1,  # 1: Thêm mới/Chuyển đến
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

    allowed_fields = {
        "SoNha": "so_nha", "Duong": "duong",
        "Phuong": "phuong", "Quan": "quan",
        "DienTich": "dien_tich",  # Cho phép sửa diện tích
        "ChuHoID": "chu_ho_id"
    }

    # Nếu đổi chủ hộ, cần logic phức tạp hơn (tạm thời chỉ update field)
    # TODO: Nếu đổi chủ hộ -> update quan hệ chủ hộ cũ thành thành viên

    has_changed = False
    for json_key, model_attr in allowed_fields.items():
        if json_key in data:
            setattr(hk, model_attr, data[json_key])
            has_changed = True

    if "NgayLamHoKhau" in data:
        hk.ngay_lam_ho_khau = parse_date(data["NgayLamHoKhau"])
        has_changed = True

    if has_changed:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"
    return serialize_hokhau(hk)


# --- TÍNH NĂNG MỚI: TÁCH HỘ KHẨU ---
def tach_hokhau(data):
    """
    Input data:
    {
        "idHoKhauCu": 1,
        "idChuHoMoi": 5, (Người này đang ở hộ cũ hoặc chưa có hộ)
        "dsThanhVienSangHoMoi": [5, 6, 7], (List ID nhân khẩu)
        "DiaChiMoi": "...",
        "DienTichMoi": 80
    }
    """
    try:
        # 1. Tạo hộ mới
        chu_ho_moi_id = data.get("idChuHoMoi")
        hk_moi = HoKhau(
            so_nha=data.get("DiaChiMoi"),  # Giản lược
            duong=data.get("Duong"),  # Hoặc lấy chi tiết từ input
            dien_tich=data.get("DienTichMoi", 0),
            ngay_lam_ho_khau=datetime.now().date(),
            chu_ho_id=chu_ho_moi_id
        )
        db.session.add(hk_moi)
        db.session.flush()  # Có ID mới

        # 2. Di chuyển thành viên sang hộ mới
        ds_thanh_vien_ids = data.get("dsThanhVienSangHoMoi", [])

        # Đảm bảo chủ hộ mới cũng nằm trong danh sách chuyển
        if chu_ho_moi_id not in ds_thanh_vien_ids:
            ds_thanh_vien_ids.append(chu_ho_moi_id)

        for nk_id in ds_thanh_vien_ids:
            nk = NhanKhau.query.get(nk_id)
            if nk:
                # Ghi lịch sử chuyển đi ở hộ cũ (nếu có)
                if nk.ho_khau_id:
                    ls_ra = LichSuHoKhau(
                        nhan_khau_id=nk.id,
                        ho_khau_id=nk.ho_khau_id,
                        loai_thay_doi=2,  # 2: Chuyển đi
                        thoi_gian=datetime.now().date()
                    )
                    db.session.add(ls_ra)

                # Update sang hộ mới
                nk.ho_khau_id = hk_moi.so_ho_khau
                if nk.id == chu_ho_moi_id:
                    nk.quan_he_voi_chu_ho = "Chủ hộ"
                else:
                    nk.quan_he_voi_chu_ho = "Thành viên"  # Hoặc bắt input nhập cụ thể

                # Ghi lịch sử chuyển đến hộ mới
                ls_vao = LichSuHoKhau(
                    nhan_khau_id=nk.id,
                    ho_khau_id=hk_moi.so_ho_khau,
                    loai_thay_doi=1,  # 1: Chuyển đến
                    thoi_gian=datetime.now().date()
                )
                db.session.add(ls_vao)

        db.session.commit()
        return serialize_hokhau(hk_moi)
    except Exception as e:
        db.session.rollback()
        print(e)
        return None


def delete_hokhau(id):
    hk = HoKhau.query.get(id)
    if not hk: return False
    # TODO: Cần check xem hộ còn người không? Nếu còn người thì không cho xóa
    db.session.delete(hk)
    db.session.commit()
    return True