from flask import jsonify
from ..services.thong_ke_service import (
    get_doanh_thu_thang_hien_tai,
    get_so_can_ho_chua_dong_phi,
    get_tong_cu_dan,
    get_doanh_thu_6_thang_gan_nhat,
    get_co_cau_dan_cu,
    get_thong_ke_gioi_tinh,
    get_thong_ke_do_tuoi
)

def get_financial_statistics_controller():
    """Thống kê dành cho Kế toán: Doanh thu và Nợ phí"""
    return jsonify({
        "cards": {
            "tong_doanh_thu": get_doanh_thu_thang_hien_tai(),
            "can_ho_no_phi": get_so_can_ho_chua_dong_phi()
        },
        "charts": {
            "doanh_thu_6_thang": get_doanh_thu_6_thang_gan_nhat()
        }
    }), 200

def get_population_statistics_controller():
    """Thống kê dành cho Tổ trưởng: Dân cư"""
    return jsonify({
        "cards": {
            "tong_cu_dan": get_tong_cu_dan()
        },
        "charts": {
            "co_cau_dan_cu": get_co_cau_dan_cu(), # Cơ cấu (Thường trú/Tạm trú/Tạm vắng)
            "phan_bo_gioi_tinh": get_thong_ke_gioi_tinh(), # Tỷ lệ Nam/Nữ (Pie Chart)
            "phan_bo_do_tuoi": get_thong_ke_do_tuoi() # Phân bố độ tuổi (Bar Chart)
        }
    }), 200