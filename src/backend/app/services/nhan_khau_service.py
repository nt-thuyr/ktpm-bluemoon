from app.extensions import db
from app.models.nhan_khau import NhanKhau

def serialize_nhankhau(nk: NhanKhau):
    return {
        "id": nk.id,
        "HoTen": nk.HoTen,
        "NgaySinh": nk.NgaySinh,
        "GioiTinh": nk.GioiTinh,
        "DanToc": nk.DanToc,
        "TonGiao": nk.TonGiao,
        "cccd": nk.cccd,
        "NgayCap": nk.NgayCap,
        "NoiCap": nk.NoiCap,
        "NgheNghiep": nk.NgheNghiep,
        "GhiChu": nk.GhiChu,
    }

def get_all_nhankhau():
    rows = NhanKhau.query.all()
    return [serialize_nhankhau(r) for r in rows]

def get_nhankhau_by_id(id):
    r = NhanKhau.query.get(id)
    return serialize_nhankhau(r) if r else None

def create_nhankhau(data):
    nk = NhanKhau(**data)
    db.session.add(nk)
    db.session.commit()
    return serialize_nhankhau(nk)

def update_nhankhau(id, data):
    nk = NhanKhau.query.get(id)
    if not nk:
        return None
    for k, v in data.items():
        setattr(nk, k, v)
    db.session.commit()
    return serialize_nhankhau(nk)

def delete_nhankhau(id):
    nk = NhanKhau.query.get(id)
    db.session.delete(nk)
    db.session.commit()

