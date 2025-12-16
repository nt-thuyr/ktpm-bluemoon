from datetime import date
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models.khoan_thu import KhoanThu


def parse_date(value):
    """
    Chuyển string ISO (YYYY-MM-DD) -> date
    """
    if not value:
        return None
    if isinstance(value, date):
        return value
    return date.fromisoformat(value)


def serialize_khoan_thu(kt: KhoanThu):
    return {
        "Id": kt.id,
        "NgayTao": kt.ngay_tao.isoformat() if kt.ngay_tao else None,
        "ThoiHan": kt.thoi_han.isoformat() if kt.thoi_han else None,
        "TenKhoanThu": kt.ten_khoan_thu,
        "BatBuoc": kt.bat_buoc,
        "GhiChu": kt.ghi_chu,
    }


# =========================
# Query
# =========================
def get_all_khoan_thu():
    rows = KhoanThu.query.order_by(KhoanThu.ngay_tao.desc()).all()
    return [serialize_khoan_thu(r) for r in rows]


def get_khoan_thu_by_id(khoan_thu_id: int):
    kt = KhoanThu.query.get(khoan_thu_id)
    return serialize_khoan_thu(kt) if kt else None


# =========================
# Create
# =========================
def create_khoan_thu(data: dict):
    """
    Tạo khoản thu mới
    NgayTao do hệ thống sinh
    """
    if not data.get("TenKhoanThu"):
        return "invalid"

    try:
        kt = KhoanThu(
            ngay_tao=date.today(),
            thoi_han=parse_date(data.get("ThoiHan")),
            ten_khoan_thu=data["TenKhoanThu"],
            bat_buoc=bool(data.get("BatBuoc", False)),
            ghi_chu=data.get("GhiChu"),
        )
        db.session.add(kt)
        db.session.commit()
        return serialize_khoan_thu(kt)

    except IntegrityError:
        db.session.rollback()
        return "conflict"


# =========================
# Update
# =========================
def update_khoan_thu(khoan_thu_id: int, data: dict):
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return None

    # Chỉ cho phép update các trường an toàn
    allowed_fields = {
        "ThoiHan": "thoi_han",
        "TenKhoanThu": "ten_khoan_thu",
        "BatBuoc": "bat_buoc",
        "GhiChu": "ghi_chu",
    }

    has_change = False

    for json_key, model_attr in allowed_fields.items():
        if json_key not in data:
            continue

        value = data[json_key]

        # Parse date nếu cần
        if model_attr == "thoi_han":
            value = parse_date(value)

        # Tránh update vô nghĩa
        if getattr(kt, model_attr) != value:
            setattr(kt, model_attr, value)
            has_change = True

    if not has_change:
        return serialize_khoan_thu(kt)

    try:
        db.session.commit()
        return serialize_khoan_thu(kt)
    except IntegrityError:
        db.session.rollback()
        return "conflict"


# =========================
# Delete
# =========================
def delete_khoan_thu(khoan_thu_id: int):
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return False

    # Ràng buộc nghiệp vụ:
    # Không cho xóa khoản thu đã có nộp tiền
    if kt.nop_tien and len(kt.nop_tien) > 0:
        return "has_payment"

    db.session.delete(kt)
    db.session.commit()
    return True
