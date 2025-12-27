from flask import Blueprint, request, jsonify
from ..controllers.nhan_khau_controller import (
    get_all_nhankhau_controller,
    get_nhankhau_by_id_controller,
    create_nhankhau_controller,
    update_nhankhau_controller,
    delete_nhankhau_controller
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_TO_TRUONG

nhan_khau_bp = Blueprint("nhan_khau", __name__)

# --- API LẤY DANH SÁCH & TÌM KIẾM ---
# URL: /api/nhankhau?keyword=...
@nhan_khau_bp.route("/", methods=["GET"])
@role_required()
def route_get_all():
    return get_all_nhankhau_controller()

# --- API CHI TIẾT ---
@nhan_khau_bp.route("/<int:id>", methods=["GET"])
@role_required()
def route_get_by_id(id):
    return get_nhankhau_by_id_controller(id)

# --- API THÊM (Chỉ Tổ Trưởng) ---
@nhan_khau_bp.route("/", methods=["POST"])
@role_required(ROLE_TO_TRUONG)
def route_create():
    try:
        return create_nhankhau_controller(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- API SỬA (Chỉ Tổ Trưởng) ---
@nhan_khau_bp.route("/<int:id>", methods=["PUT"])
@role_required(ROLE_TO_TRUONG)
def route_update(id):
    try:
        return update_nhankhau_controller(id, request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- API XÓA (Chỉ Tổ Trưởng) ---
@nhan_khau_bp.route("/<int:id>", methods=["DELETE"])
@role_required(ROLE_TO_TRUONG)
def route_delete(id):
    return delete_nhankhau_controller(id)