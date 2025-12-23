from datetime import date
from sqlalchemy import extract, func
from ..extensions import db
from ..models.nop_tien import NopTien
from ..models.ho_khau import HoKhau
from ..models.khoan_thu import KhoanThu

def get_doanh_thu_thang_hien_tai():
    today = date.today()

    total = (
        db.session.query(func.coalesce(func.sum(NopTien.so_tien), 0))
        .filter(
            extract("month", NopTien.ngay_nop) == today.month,
            extract("year", NopTien.ngay_nop) == today.year,
        )
        .scalar()
    )

    return float(total)

def get_so_can_ho_chua_dong_phi():
    ho_khau_list = HoKhau.query.all()
    khoan_thu_bat_buoc = KhoanThu.query.filter_by(bat_buoc=True).all()

    dem = 0

    for hk in ho_khau_list:
        chua_dong = False

        for kt in khoan_thu_bat_buoc:
            da_nop = (
                db.session.query(func.coalesce(func.sum(NopTien.so_tien), 0))
                .filter(
                    NopTien.ho_khau_id == hk.so_ho_khau,
                    NopTien.khoan_thu_id == kt.id,
                )
                .scalar()
            )

            if da_nop < kt.so_tien:
                chua_dong = True
                break

        if chua_dong:
            dem += 1

    return dem
