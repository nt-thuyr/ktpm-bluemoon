from flask import jsonify
from ..services.thong_ke_service import (
    get_doanh_thu_thang_hien_tai,
    get_so_can_ho_chua_dong_phi,
)

def get_all_thong_ke_controller():
    return jsonify({
        "TongDoanhThuThangNay": get_doanh_thu_thang_hien_tai(),
        "CanHoChuaDongPhi": get_so_can_ho_chua_dong_phi()
    }), 200
