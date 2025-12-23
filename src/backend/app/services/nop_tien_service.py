from datetime import date
from sqlalchemy.exc import IntegrityError

from ..extensions import db
from ..models.nop_tien import NopTien

# TODO: sử dụng marshmallow để validate input thay vì mapping thủ công
def parse_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    return date.fromisoformat(value)

# Support mixed input key styles (Pascal/CamelCase and snake_case)
def _normalize_noptien_input(data: dict) -> dict:
    if not isinstance(data, dict):
        return data
    mapping = {
        "HoKhauId": ["HoKhauId", "ho_khau_id", "hoKhauId", "hoKhauID"],
        "KhoanThuId": ["KhoanThuId", "khoan_thu_id", "khoanThuId", "khoanThuID"],
        "SoTien": ["SoTien", "so_tien", "soTien"],
        "NgayNop": ["NgayNop", "ngay_nop", "ngayNop"],
        "NguoiNop": ["NguoiNop", "nguoi_nop", "nguoiNop"],
    }
    out = {}
    for key, aliases in mapping.items():
        for a in aliases:
            if a in data:
                out[key] = data[a]
                break
    # include other fields unchanged
    for k, v in data.items():
        if k not in sum(mapping.values(), []):
            out[k] = v
    return out


def serialize_noptien(nt: NopTien):
    return {
        "Id": nt.id,
        "HoKhauId": nt.ho_khau_id,
        "KhoanThuId": nt.khoan_thu_id,
        "SoTien": float(nt.so_tien),
        "NgayNop": nt.ngay_nop.isoformat() if nt.ngay_nop else None,
        "NguoiNop": nt.nguoi_nop,
    }


def get_list_noptien():
    rows = NopTien.query.order_by(NopTien.ngay_nop.desc()).all()
    return [serialize_noptien(r) for r in rows]


def get_noptien_by_id(nop_tien_id: int):
    nt = NopTien.query.get(nop_tien_id)
    return serialize_noptien(nt) if nt else None


def get_noptien_by_ho_khau(ho_khau_id: int):
    rows = NopTien.query.filter_by(
        ho_khau_id=ho_khau_id
    ).order_by(NopTien.ngay_nop.desc()).all()

    return [serialize_noptien(r) for r in rows]


def get_noptien_by_khoan_thu(khoan_thu_id: int):
    rows = NopTien.query.filter_by(
        khoan_thu_id=khoan_thu_id
    ).order_by(NopTien.ngay_nop.desc()).all()

    return [serialize_noptien(r) for r in rows]


def create_noptien(data: dict):
    """
    Ghi nhận 1 lần nộp tiền
    """
    data = _normalize_noptien_input(data)
    required_fields = ["HoKhauId", "KhoanThuId", "SoTien"]

    for field in required_fields:
        if field not in data:
            return "invalid"

    try:
        nt = NopTien(
            ho_khau_id=data["HoKhauId"],
            khoan_thu_id=data["KhoanThuId"],
            so_tien=data["SoTien"],
            ngay_nop=parse_date(data.get("NgayNop")) or date.today(),
            nguoi_nop=data.get("NguoiNop"),
        )

        db.session.add(nt)
        db.session.commit()
        return serialize_noptien(nt)

    except IntegrityError:
        db.session.rollback()
        return "error"


def delete_noptien(nop_tien_id: int):
    nt = NopTien.query.get(nop_tien_id)
    if not nt:
        return False

    db.session.delete(nt)
    db.session.commit()
    return True
