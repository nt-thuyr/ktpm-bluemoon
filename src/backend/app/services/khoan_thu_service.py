from ..extensions import db
from ..models.khoan_thu import KhoanThu
from ..schemas.khoan_thu_schema import KhoanThuSchema
from sqlalchemy.exc import IntegrityError

khoan_thu_schema = KhoanThuSchema()
list_khoan_thu_schema = KhoanThuSchema(many=True)


def get_all_khoanthu():
    rows = KhoanThu.query.order_by(KhoanThu.id.desc()).all()
    return list_khoan_thu_schema.dump(rows)


def get_khoanthu_by_id(khoan_thu_id: int):
    kt = KhoanThu.query.get(khoan_thu_id)
    return khoan_thu_schema.dump(kt) if kt else None


def create_khoanthu(data: dict):
    errors = khoan_thu_schema.validate(data)
    if errors:
        return "invalid"

    try:
        validated_data = khoan_thu_schema.load(data)
        kt = KhoanThu(**validated_data)

        db.session.add(kt)
        db.session.commit()
        return khoan_thu_schema.dump(kt)

    except IntegrityError:
        db.session.rollback()
        return "conflict"


def update_khoanthu(khoan_thu_id: int, data: dict):
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return None

    errors = khoan_thu_schema.validate(data, partial=True)
    if errors:
        return "invalid"

    validated_data = khoan_thu_schema.load(data, partial=True)

    has_change = False
    for attr, value in validated_data.items():
        if getattr(kt, attr) != value:
            setattr(kt, attr, value)
            has_change = True

    if has_change:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "conflict"

    return khoan_thu_schema.dump(kt)


def delete_khoanthu(khoan_thu_id: int):
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return False

    if kt.nop_tien and len(kt.nop_tien) > 0:
        return "has_payment"

    db.session.delete(kt)
    db.session.commit()
    return True