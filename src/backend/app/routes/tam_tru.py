from flask import Blueprint, request, jsonify
from ..controllers.tam_tru_controller import (
    create_tamtru_controller,
    get_all_tamtru_controller,
    update_tamtru_controller,
    delete_tamtru_controller
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_TO_TRUONG

tam_tru_bp = Blueprint("tam_tru", __name__)

# --- GET (Lấy danh sách / Tìm kiếm) ---
@tam_tru_bp.route("/", methods=["GET"])
@role_required()
def route_get():
    return get_all_tamtru_controller()

# --- POST (Đăng ký mới - Chỉ Tổ Trưởng) ---
@tam_tru_bp.route("/", methods=["POST"])
@role_required(ROLE_TO_TRUONG)
def route_create():
    try:
        return create_tamtru_controller(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- PUT (Cập nhật - Chỉ Tổ Trưởng) ---
@tam_tru_bp.route("/<int:id>", methods=["PUT"])
@role_required(ROLE_TO_TRUONG)
def route_update(id):
    
    try:
        return update_tamtru_controller(id, request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- DELETE (Xóa - Chỉ Tổ Trưởng) ---
@tam_tru_bp.route("/<int:id>", methods=["DELETE"])
@role_required(ROLE_TO_TRUONG)
def route_delete(id):
    return delete_tamtru_controller(id)