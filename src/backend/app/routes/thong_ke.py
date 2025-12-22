from flask import Blueprint
from ..controllers.thong_ke_controller import (
    get_financial_statistics_controller,
    get_population_statistics_controller
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_KE_TOAN, ROLE_TO_TRUONG

thong_ke_bp = Blueprint("statistics", __name__)

@thong_ke_bp.route("/dashboard/tai-chinh", methods=["GET"])
@role_required(ROLE_KE_TOAN)
def route_financial_statistics():
    """Chỉ Kế toán có quyền xem thông tin tài chính"""
    return get_financial_statistics_controller()

@thong_ke_bp.route("/dashboard/dan-cu", methods=["GET"])
@role_required(ROLE_TO_TRUONG)
def route_population_statistics():
    """Chỉ Tổ trưởng có quyền xem thông tin dân cư"""
    return get_population_statistics_controller()