from datetime import date
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from ..extensions import db
from ..models.phai_dong import PhaiDong
from ..models.khoan_thu import KhoanThu
from ..models.ho_khau import HoKhau
from ..models.nop_tien import NopTien


def parse_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    return date.fromisoformat(value)


def sum_da_nop(ho_khau_id: int, khoan_thu_id: int) -> Decimal:
    # Tổng số tiền đã nộp của 1 hộ cho 1 khoản thu.
    total = (
        db.session.query(func.coalesce(func.sum(NopTien.so_tien), 0))
        .filter(
            NopTien.ho_khau_id == ho_khau_id,
            NopTien.khoan_thu_id == khoan_thu_id,
        )
        .scalar()
    )
    # đảm bảo kiểu Decimal để trừ chính xác
    return Decimal(total)


def calc_trang_thai(so_tien_phai_dong: Decimal, da_nop: Decimal, han_nop) -> str:
    if da_nop <= 0:
        return "CHUA_NOP"
    if da_nop < so_tien_phai_dong:
        return "DA_NOP_MOT_PHAN"
    return "DA_NOP_DU"


def serialize_phai_dong(pd: PhaiDong):
    da_nop = sum_da_nop(pd.ho_khau_id, pd.khoan_thu_id)
    con_no = Decimal(pd.so_tien_phai_dong) - da_nop

    qua_han = bool(pd.han_nop and pd.han_nop < date.today() and con_no > 0)

    return {
        "HoKhauId": pd.ho_khau_id,
        "KhoanThuId": pd.khoan_thu_id,
        "SoTienPhaiDong": float(pd.so_tien_phai_dong),
        "DaNop": float(da_nop),
        "ConNo": float(con_no),
        "HanNop": pd.han_nop.isoformat() if pd.han_nop else None,
        "TrangThai": pd.trang_thai,  
        "QuaHan": qua_han,          
    }


# =========================
# Core sync logic
# =========================
def sync_trang_thai_phai_dong(ho_khau_id: int, khoan_thu_id: int):
    """
    Đồng bộ trạng thái phai_dong dựa trên tổng đã nộp.
    Nên gọi sau khi tạo/xóa nộp tiền hoặc khi cần refresh.
    """
    pd = PhaiDong.query.get((ho_khau_id, khoan_thu_id))
    if not pd:
        return None

    da_nop = sum_da_nop(ho_khau_id, khoan_thu_id)
    new_status = calc_trang_thai(Decimal(pd.so_tien_phai_dong), da_nop)

    if pd.trang_thai != new_status:
        pd.trang_thai = new_status
        db.session.commit()

    return serialize_phai_dong(pd)


# =========================
# Generate PhaiDong 
# =========================
def generate_phai_dong_for_khoan_thu(khoan_thu_id: int, calculator_func):
    """
    Sinh phai_dong cho TẤT CẢ hộ khẩu khi tạo KhoanThu.
    calculator_func(hk) -> số tiền phải đóng (Decimal/int/float đều được)
    """
    kt = KhoanThu.query.get(khoan_thu_id)
    if not kt:
        return None

    ho_khau_list = HoKhau.query.all()

    try:
        for hk in ho_khau_list:
            so_tien = calculator_func(hk)
            if so_tien is None:
                so_tien = 0

            pd = PhaiDong(
                ho_khau_id=hk.so_ho_khau,
                khoan_thu_id=kt.id,
                so_tien_phai_dong=Decimal(str(so_tien)),
                han_nop=kt.thoi_han,
                trang_thai="CHUA_NOP",
            )
            db.session.add(pd)

        db.session.commit()
        return True

    except IntegrityError:
        db.session.rollback()
        return "conflict"


# =========================
# Query
# =========================
def get_phai_dong_by_khoan_thu(khoan_thu_id: int):
    rows = PhaiDong.query.filter_by(khoan_thu_id=khoan_thu_id).all()
    return [serialize_phai_dong(r) for r in rows]


def get_phai_dong_by_ho_khau(ho_khau_id: int):
    rows = PhaiDong.query.filter_by(ho_khau_id=ho_khau_id).all()
    return [serialize_phai_dong(r) for r in rows]


def get_phai_dong_qua_han():
    """
    Quá hạn = han_nop < hôm nay và còn nợ (con_no > 0)
    """
    rows = PhaiDong.query.filter(PhaiDong.han_nop.isnot(None), PhaiDong.han_nop < date.today()).all()
    # Lọc thêm con_no > 0 ở tầng python vì cần sum NopTien
    return [serialize_phai_dong(r) for r in rows if r and r.so_tien_phai_dong is not None]


# =========================
# Update hạn nộp 
# =========================
def gia_han_phai_dong(ho_khau_id: int, khoan_thu_id: int, han_nop_moi):
    pd = PhaiDong.query.get((ho_khau_id, khoan_thu_id))
    if not pd:
        return None

    han_nop_moi = parse_date(han_nop_moi)
    if not han_nop_moi:
        return "invalid"

    # chỉ cho phép gia hạn (mới > cũ)
    if pd.han_nop and han_nop_moi <= pd.han_nop:
        return "invalid"

    pd.han_nop = han_nop_moi
    db.session.commit()
    return serialize_phai_dong(pd)
