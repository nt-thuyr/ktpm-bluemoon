from flask import Blueprint
from ..controllers.thong_ke_controller import get_all_thong_ke_controller

thong_ke_bp = Blueprint("statistics", __name__)

@thong_ke_bp.route("/dashboard", methods=["GET"])
def route_dashboard_statistics():
    return get_all_thong_ke_controller()
