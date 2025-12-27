from flask import Blueprint, request, jsonify
from ..controllers.ho_khau_controller import (
    get_all_hokhau_controller,
    get_hokhau_by_id_controller,
    create_hokhau_controller,
    update_hokhau_controller,
    delete_hokhau_controller,
    tach_hokhau_controller, get_lich_su_controller
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_TO_TRUONG

ho_khau_bp = Blueprint("ho_khau", __name__)

# --- API LẤY DANH SÁCH & TÌM KIẾM ---
# URL: /api/hokhau?keyword=...
@ho_khau_bp.route("/", methods=["GET"])
@role_required()
def route_get_all():
    return get_all_hokhau_controller()

# --- API LẤY CHI TIẾT ---
@ho_khau_bp.route("/<int:id>", methods=["GET"])
@role_required()
def route_get_by_id(id):
    return get_hokhau_by_id_controller(id)

@ho_khau_bp.route("/<int:id>/lich-su", methods=["GET"])
@role_required()
def route_get_history(id):
    return get_lich_su_controller(id)

# --- API THÊM MỚI (Chỉ Tổ Trưởng) ---
@ho_khau_bp.route("/", methods=["POST"])
@role_required(ROLE_TO_TRUONG)
def route_create():
    try:
        return create_hokhau_controller(request.get_json())
    except Exception as e:
        # Bắt lỗi server bất ngờ
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# --- API TÁCH HỘ (Chỉ Tổ Trưởng) ---
@ho_khau_bp.route("/tach-ho", methods=["POST"])
@role_required(ROLE_TO_TRUONG)
def route_tach_ho():
    try:
        return tach_hokhau_controller(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- API SỬA (Chỉ Tổ Trưởng) ---
@ho_khau_bp.route("/<int:id>", methods=["PUT"])
@role_required(ROLE_TO_TRUONG)
def route_update(id):
    try:
        return update_hokhau_controller(id, request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- API XÓA (Chỉ Tổ Trưởng) ---
@ho_khau_bp.route("/<int:id>", methods=["DELETE"])
@role_required(ROLE_TO_TRUONG)
def route_delete(id):
    return delete_hokhau_controller(id)