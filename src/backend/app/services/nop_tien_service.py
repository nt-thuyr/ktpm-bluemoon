from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError

from ..extensions import db
from ..models.nop_tien import NopTien
from ..schemas.nop_tien_schema import NopTienSchema
from sqlalchemy.orm import joinedload
from ..models.ho_khau import HoKhau

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


def get_noptien_detail_for_pdf(nop_tien_id: int):
    nt = NopTien.query.options(
        joinedload(NopTien.ho_khau).joinedload(HoKhau.chu_ho),
        joinedload(NopTien.khoan_thu)
    ).get(nop_tien_id)

    if not nt:
        return None

    hk = nt.ho_khau
    if hk and hk.chu_ho:
        ten_chu_ho = hk.chu_ho.ho_ten
        cccd = hk.chu_ho.cccd
    else:
        ten_chu_ho = "Chưa xác định"
        cccd = "...................."

    return {
        "ma_bien_lai": nt.id,
        "ngay_nop": nt.ngay_nop,
        "nguoi_nop": nt.nguoi_nop or ten_chu_ho,
        "cccd": cccd,
        "ten_khoan_thu": nt.khoan_thu.ten_khoan_thu if nt.khoan_thu else "Khoản thu khác",
        "so_tien": float(nt.so_tien),
        "dia_chi": f"P.{hk.phuong}, Q.{hk.quan}" if hk else ""
    }