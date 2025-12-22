from datetime import date
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models.khoan_thu import KhoanThu
# TODO: sử dụng marshmallow để validate input thay vì mapping thủ công
def parse_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    return date.fromisoformat(value)

# Helper: normalize input keys (support both camel/PascalCase and snake_case)
def _normalize_khoanthu_input(data: dict) -> dict:
    if not isinstance(data, dict):
        return data
    mapping = {
        "TenKhoanThu": ["TenKhoanThu", "ten_khoan_thu", "tenKhoanThu"],
        "SoTien": ["SoTien", "so_tien", "soTien"],
        "BatBuoc": ["BatBuoc", "bat_buoc", "batBuoc"],
        "GhiChu": ["GhiChu", "ghi_chu", "ghiChu"],
    }
    out = {}
    for key, aliases in mapping.items():
        for a in aliases:
            if a in data:
                out[key] = data[a]
                break
    # preserve any other fields
    for k, v in data.items():
        if k not in sum(mapping.values(), []):
            out[k] = v
    return out

def serialize_khoanthu(kt: KhoanThu):
    return {
        "Id": kt.id,
        "TenKhoanThu": kt.ten_khoan_thu,
        "SoTien": float(kt.so_tien),
        "BatBuoc": kt.bat_buoc,
        "GhiChu": kt.ghi_chu,
    }

def get_all_khoanthu():
    rows = KhoanThu.query.order_by(KhoanThu.id.desc()).all()
    return [serialize_khoanthu(r) for r in rows]

def get_khoanthu_by_id(khoan_thu_id: int):
    kt = KhoanThu.query.get(khoan_thu_id)
    return serialize_khoanthu(kt) if kt else None

def create_khoanthu(data: dict):
    data = _normalize_khoanthu_input(data)
    required_fields = ["TenKhoanThu", "SoTien", "BatBuoc"]

    for field in required_fields:
        if field not in data:
            return "invalid"

    try:
        kt = KhoanThu(
            ten_khoan_thu=data["TenKhoanThu"],
            so_tien=data["SoTien"],
            bat_buoc=bool(data["BatBuoc"]),
            ghi_chu=data.get("GhiChu"),
        )

        db.session.add(kt)
        db.session.commit()
        return serialize_khoanthu(kt)

    except IntegrityError:
        db.session.rollback()
        return "conflict"

def update_khoanthu(khoan_thu_id: int, data: dict):
    data = _normalize_khoanthu_input(data)
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return None

    allowed_fields = {
        "TenKhoanThu": "ten_khoan_thu",
        "SoTien": "so_tien",
        "BatBuoc": "bat_buoc",
        "GhiChu": "ghi_chu",
    }

    has_change = False

    for json_key, model_attr in allowed_fields.items():
        if json_key not in data:
            continue

        value = data[json_key]

        if getattr(kt, model_attr) != value:
            setattr(kt, model_attr, value)
            has_change = True

    if not has_change:
        return serialize_khoanthu(kt)

    try:
        db.session.commit()
        return serialize_khoanthu(kt)
    except IntegrityError:
        db.session.rollback()
        return "conflict"

def delete_khoanthu(khoan_thu_id: int):
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return False

    if kt.nop_tien and len(kt.nop_tien) > 0:
        return "has_payment"

    db.session.delete(kt)
    db.session.commit()
    return True
