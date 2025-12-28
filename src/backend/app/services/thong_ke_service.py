from datetime import date, timedelta
from sqlalchemy import extract, func
from ..extensions import db
from ..models.nop_tien import NopTien
from ..models.ho_khau import HoKhau
from ..models.khoan_thu import KhoanThu
from ..models.nhan_khau import NhanKhau
from ..models.tam_tru_tam_vang import TamTruTamVang

# ---- THỐNG KÊ THU PHÍ ----
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

# ---- THỐNG KÊ DÂN CƯ ----
def get_tong_cu_dan():
    return NhanKhau.query.count()

# 1. Thống kê tỷ lệ nam/nữ
def get_thong_ke_gioi_tinh(): # Trả về format cho biểu đồ tròn (Pie Chart)
    # Query group by giới tính và đếm
    query = db.session.query(
        NhanKhau.gioi_tinh,
        func.count(NhanKhau.id)
    ).group_by(NhanKhau.gioi_tinh).all()

    results = []
    
    # Mapping để sửa lỗi mất dấu và map màu
    label_map = {
        "Nam": {"label": "Nam", "color": "var(--color-nam)"},
        "Nu":  {"label": "Nữ", "color": "var(--color-nu)"},  # Fix "Nu" -> "Nữ"
        "Nữ":  {"label": "Nữ", "color": "var(--color-nu)"},
        "Khác": {"label": "Khác", "color": "var(--color-khac)"}
    }

    for gioi_tinh, so_luong in query:
        # Nếu gioi_tinh là None thì để là "Khác" hoặc "Không xác định"
        db_value = gioi_tinh if gioi_tinh else "Khác"
        
        # Lấy thông tin chuẩn từ map, nếu ko có thì dùng mặc định
        info = label_map.get(db_value, {"label": db_value, "color": "#f474c1"})
        
        results.append({
            "name": info["label"],
            "value": so_luong,
            "fill": info["color"]
        })

    return results

# 2. Thống kê theo độ tuổi
def get_thong_ke_do_tuoi(): # Trả về format cho biểu đồ cột (Bar Chart)
    today = date.today()
    all_dates = db.session.query(NhanKhau.ngay_sinh).filter(NhanKhau.ngay_sinh.isnot(None)).all()
    stats = {
        "Trẻ em (0-17)": 0,
        "Lao động (18-60)": 0,
        "Người cao tuổi (>60)": 0
    }

    for row in all_dates:
        dob = row.ngay_sinh
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

        if age < 18:
            stats["Trẻ em (0-17)"] += 1
        elif age <= 60:
            stats["Lao động (18-60)"] += 1
        else:
            stats["Người cao tuổi (>60)"] += 1


    return [
        {"name": "Dưới 18 tuổi", "value": stats["Trẻ em (0-17)"], "fill": "#0088FE"},
        {"name": "18 - 60 tuổi", "value": stats["Lao động (18-60)"], "fill": "#00C49F"},
        {"name": "Trên 60 tuổi", "value": stats["Người cao tuổi (>60)"], "fill": "#FFBB28"},
    ]


# 3. Thống kê cơ cấu dân cư (Tạm trú/Tạm vắng/Thường trú)
def get_co_cau_dan_cu():
    # Tổng = Thường trú (đang ở) + Tạm trú (người nơi khác đến) + Tạm vắng (người ở đây đi nơi khác)

    tam_tru = TamTruTamVang.query.filter_by(trang_thai="Tạm trú").count()
    tam_vang = TamTruTamVang.query.filter_by(trang_thai="Tạm vắng").count()
    tong_nhan_khau = NhanKhau.query.count()

    # Tính thường trú thực tế
    thuong_tru = max(0, tong_nhan_khau - (tam_tru + tam_vang))

    return [
        {"name": "Thường trú", "value": thuong_tru, "fill": "#0088FE"},
        {"name": "Tạm trú", "value": tam_tru, "fill": "#00C49F"},
        {"name": "Tạm vắng", "value": tam_vang, "fill": "#FFBB28"},
    ]