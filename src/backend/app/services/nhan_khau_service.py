from ..extensions import db
from ..models.nhan_khau import NhanKhau
from sqlalchemy.exc import IntegrityError


def serialize_nhankhau(nk: NhanKhau):
    # Logic: Phải gọi đúng tên biến đã khai báo trong Model (ho_ten, ngay_sinh...)
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
    }


def get_all_nhankhau():
    rows = NhanKhau.query.all()
    return [serialize_nhankhau(r) for r in rows]


def get_nhankhau_by_id(id):
    r = NhanKhau.query.get(id)
    return serialize_nhankhau(r) if r else None


def create_nhankhau(data):
    # Logic: Lấy từng trường cụ thể để tránh lỗi key lạ từ request
    try:
        nk = NhanKhau(
            ho_ten=data.get("HoTen"),  # Mapping key từ JSON -> Model
            ngay_sinh=data.get("NgaySinh"),
            gioi_tinh=data.get("GioiTinh"),
            dan_toc=data.get("DanToc"),
            ton_giao=data.get("TonGiao"),
            cccd=data.get("cccd"),
            ngay_cap=data.get("NgayCap"),
            noi_cap=data.get("NoiCap"),
            nghe_nghiep=data.get("NgheNghiep"),
            ghi_chu=data.get("GhiChu")
        )
        db.session.add(nk)
        db.session.commit()
        return serialize_nhankhau(nk)
    except IntegrityError:
        db.session.rollback()
        return None  # Trả về None để báo hiệu trùng lặp (ví dụ trùng CCCD)


def update_nhankhau(id, data):
    nk = NhanKhau.query.get(id)
    if not nk:
        return None

    # Logic: Chỉ cho phép update các trường an toàn (Whitelist)
    allowed_fields = {
        "HoTen": "ho_ten", "NgaySinh": "ngay_sinh", "GioiTinh": "gioi_tinh",
        "DanToc": "dan_toc", "TonGiao": "ton_giao", "cccd": "cccd",
        "NgayCap": "ngay_cap", "NoiCap": "noi_cap", "NgheNghiep": "nghe_nghiep",
        "GhiChu": "ghi_chu"
    }

    has_change = False
    for json_key, model_attr in allowed_fields.items():
        if json_key in data:
            setattr(nk, model_attr, data[json_key])
            has_change = True

    if has_change:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"  # Báo lỗi trùng lặp khi update

    return serialize_nhankhau(nk)


def delete_nhankhau(id):
    nk = NhanKhau.query.get(id)
    if nk:
        db.session.delete(nk)
        db.session.commit()
        return True  # Báo xóa thành công
    return False  # Báo không tìm thấy