from sqlalchemy.exc import IntegrityError
from ..models.ho_khau import HoKhau
from ..extensions import db

def serialize_hokhau(hk: HoKhau):
    return {
        "SoHoKhau": hk.so_ho_khau,
        "SoNha": hk.so_nha,
        "Duong": hk.duong,
        "Phuong": hk.phuong,
        "Quan": hk.quan,
        "NgayLamHoKhau": str(hk.ngay_lam_ho_khau) if hk.ngay_lam_ho_khau else None,
        "ChuHoID": hk.chu_ho_id,
    }

def get_all_hokhau():
    rows = HoKhau.query.all()
    return [serialize_hokhau(r) for r in rows]

def get_all_hokhau_by_id():
    r = HoKhau.query.get(id)
    return serialize_hokhau(r) if r else None

def create_hokhau(data):
    try:
        hk = HoKhau(
            so_nha=data.get("SoNha"),
            duong=data.get("Duong"),
            phuong=data.get("Phuong"),
            quan=data.get("Quan"),
            ngay_lam_ho_khau=data.get("NgayLamHoKhau"),
            chu_ho_id=data.get("ChuHoID")
        )
        db.session.add(hk)
        db.session.commit()
        return serialize_hokhau(hk)
    except IntegrityError:
        db.session.rollback()
        return None

def update_hokhau(id, data):
    hk = HoKhau.query.get(id)
    if not hk:
        return None

    allowed_fields = {
        "SoNha": "so_nha",
        "Duong": "duong",
        "Phuong": "phuong",
        "Quan": "quan",
        "NgayLamHoKhau": "ngay_lam_ho_khau",
        "ChuHoID": "chu_ho_id"
    }

    has_changed = False
    for json_key, model_attr in allowed_fields.items():
        if json_key in data:
            setattr(hk, model_attr, data[json_key])
            has_changed = True

    if has_changed:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"

    return serialize_hokhau(hk)

def delete_hokhau(id):
    hk = HoKhau.query.get(id)
    if not hk:
        return False

    db.session.delete(hk)
    db.session.commit()
    return True