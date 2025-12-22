from datetime import date, timedelta
from sqlalchemy import extract, func
from ..extensions import db
from ..models.nop_tien import NopTien
from ..models.ho_khau import HoKhau
from ..models.khoan_thu import KhoanThu
from ..models.nhan_khau import NhanKhau
from ..models.tam_tru_tam_vang import TamTruTamVang


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


def get_tong_cu_dan():
    return NhanKhau.query.count()


def get_doanh_thu_6_thang_gan_nhat():
    results = []
    today = date.today()
    for i in range(5, -1, -1):
        # Tính toán tháng và năm cho 6 tháng gần đây
        target_month = (today.month - i - 1) % 12 + 1
        target_year = today.year + (today.month - i - 1) // 12

        doanh_thu = (
            db.session.query(func.coalesce(func.sum(NopTien.so_tien), 0))
            .filter(
                extract("month", NopTien.ngay_nop) == target_month,
                extract("year", NopTien.ngay_nop) == target_year
            )
            .scalar()
        )
        results.append({
            "name": f"T{target_month}/{target_year}",
            "total": float(doanh_thu)
        })
    return results


def get_co_cau_dan_cu():
    tam_tru = TamTruTamVang.query.filter_by(trang_thai="Tạm trú").count()
    tam_vang = TamTruTamVang.query.filter_by(trang_thai="Tạm vắng").count()
    tong_nhan_khau = NhanKhau.query.count()

    # Những người không trong danh sách tạm trú/tạm vắng được coi là thường trú
    thuong_tru = max(0, tong_nhan_khau - (tam_tru + tam_vang))

    return [
        {"name": "Thường trú", "value": thuong_tru, "fill": "var(--color-thuong-tru)"},
        {"name": "Tạm trú", "value": tam_tru, "fill": "var(--color-tam-tru)"},
        {"name": "Tạm vắng", "value": tam_vang, "fill": "var(--color-tam-vang)"},
    ]