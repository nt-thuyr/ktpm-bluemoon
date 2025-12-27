from ..extensions import db
from ..models.khoan_thu import KhoanThu
from ..schemas.khoan_thu_schema import KhoanThuSchema
from sqlalchemy.exc import IntegrityError

khoan_thu_schema = KhoanThuSchema()
list_khoan_thu_schema = KhoanThuSchema(many=True)

# Thêm tham số lọc theo ngày tạo và hạn nộp
def get_all_khoanthu(tu_ngay=None, den_ngay=None, han_nop=None):
    query = KhoanThu.query

    # Lọc theo khoảng ngày tạo
    if tu_ngay:
        query = query.filter(KhoanThu.ngay_tao >= tu_ngay)
    if den_ngay:
        query = query.filter(KhoanThu.ngay_tao <= den_ngay)

    # Lọc theo hạn nộp (ví dụ: tìm các khoản hết hạn trước ngày này)
    if han_nop:
        query = query.filter(KhoanThu.han_nop <= han_nop)

    rows = query.order_by(KhoanThu.id.desc()).all()
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

        # 2. Thêm điều kiện: Hạn nộp không được nhỏ hơn ngày tạo
        ngay_tao = validated_data.get('ngay_tao')
        han_nop = validated_data.get('han_nop')

        if ngay_tao and han_nop and han_nop < ngay_tao:
            return "invalid_date"  # Trả về lỗi nếu hạn nộp sai logic

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

    # Validate lại ngày tháng khi update (nếu có thay đổi)
    new_ngay_tao = validated_data.get('ngay_tao', kt.ngay_tao)
    new_han_nop = validated_data.get('han_nop', kt.han_nop)

    if new_han_nop and new_ngay_tao and new_han_nop < new_ngay_tao:
        return "invalid_date"

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

    try:
        db.session.delete(kt)
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        return False