from flask import jsonify
from ..services.thong_ke_service import (
    get_doanh_thu_thang_hien_tai,
    get_so_can_ho_chua_dong_phi,
    get_tong_cu_dan,
    get_doanh_thu_6_thang_gan_nhat,
    get_co_cau_dan_cu
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
    """Thống kê dành cho Tổ trưởng: Dân cư và Hộ khẩu"""
    return jsonify({
        "cards": {
            "tong_cu_dan": get_tong_cu_dan()
        },
        "charts": {
            "co_cau_dan_cu": get_co_cau_dan_cu()
        }
    }), 200