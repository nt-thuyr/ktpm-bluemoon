from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError

from ..extensions import db
from ..models.nop_tien import NopTien
from ..schemas.nop_tien_schema import NopTienSchema

nop_tien_schema = NopTienSchema()
list_nop_tien_schema = NopTienSchema(many=True)


def get_list_noptien():
    rows = NopTien.query.order_by(NopTien.ngay_nop.desc()).all()
    return list_nop_tien_schema.dump(rows)


def get_noptien_by_id(nop_tien_id: int):
    nt = NopTien.query.get(nop_tien_id)
    return nop_tien_schema.dump(nt) if nt else None


def get_noptien_by_ho_khau(ho_khau_id: int):
    rows = NopTien.query.filter_by(
        ho_khau_id=ho_khau_id
    ).order_by(NopTien.ngay_nop.desc()).all()
    return list_nop_tien_schema.dump(rows)


def get_noptien_by_khoan_thu(khoan_thu_id: int):
    rows = NopTien.query.filter_by(
        khoan_thu_id=khoan_thu_id
    ).order_by(NopTien.ngay_nop.desc()).all()
    return list_nop_tien_schema.dump(rows)


def create_noptien(data: dict):
    """
    Ghi nhận 1 lần nộp tiền.
    Sử dụng Marshmallow để validate và deserialize dữ liệu.
    """
    try:
        clean_data = nop_tien_schema.load(data)

        nt = NopTien(**clean_data)

        db.session.add(nt)
        db.session.commit()

        return nop_tien_schema.dump(nt)

    except ValidationError as err:
        return "invalid"

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