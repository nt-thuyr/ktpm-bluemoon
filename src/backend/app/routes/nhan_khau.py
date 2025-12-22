from flask import Blueprint, request, jsonify
from ..controllers.nhan_khau_controller import (
    get_all_nhankhau_controller,
    get_nhankhau_by_id_controller,
    create_nhankhau_controller,
    update_nhankhau_controller,
    delete_nhankhau_controller
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_TO_TRUONG  # Import hằng số

nhan_khau_bp = Blueprint("nhan_khau", __name__)

# --- AI CŨNG XEM ĐƯỢC (Miễn là đã đăng nhập) ---
@nhan_khau_bp.route("/", methods=["GET"])
@role_required()
def route_get_all():
    # Kế toán cần API này để lấy danh sách người đóng tiền
    return get_all_nhankhau_controller()

@nhan_khau_bp.route("/<int:id>", methods=["GET"])
@role_required()
def route_get_by_id(id):
    return get_nhankhau_by_id_controller(id)

# --- CHỈ TỔ TRƯỞNG MỚI ĐƯỢC THAY ĐỔI ---
@nhan_khau_bp.route("/", methods=["POST"])
@role_required(ROLE_TO_TRUONG)  # Dùng hằng số thay vì string cứng
def route_create():
    try:
        return create_nhankhau_controller(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@nhan_khau_bp.route("/<int:id>", methods=["PUT"])
@role_required(ROLE_TO_TRUONG)
def route_update(id):
    try:
        return update_nhankhau_controller(id, request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@nhan_khau_bp.route("/<int:id>", methods=["DELETE"])
@role_required(ROLE_TO_TRUONG)
def route_delete(id):
    return delete_nhankhau_controller(id)