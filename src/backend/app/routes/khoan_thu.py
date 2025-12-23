from flask import Blueprint, request, jsonify
from ..controllers.khoan_thu_controller import (
    get_all_khoanthu_controller,
    get_khoanthu_by_id_controller,
    create_khoanthu_controller,
    update_khoanthu_controller,
    delete_khoanthu_controller,
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_KE_TOAN

khoan_thu_bp = Blueprint("khoan_thu", __name__)

@khoan_thu_bp.route("/", methods=["GET"])
@role_required()
def route_get_all():
    return get_all_khoanthu_controller()

@khoan_thu_bp.route("/<int:khoan_thu_id>", methods=["GET"])
@role_required()
def route_get_by_id(khoan_thu_id):
    return get_khoanthu_by_id_controller(khoan_thu_id)

@khoan_thu_bp.route("/", methods=["POST"])
@role_required(ROLE_KE_TOAN)
def route_create():
    try:
        payload = request.get_json()
        return create_khoanthu_controller(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@khoan_thu_bp.route("/<int:khoan_thu_id>", methods=["PUT"])
@role_required(ROLE_KE_TOAN)
def route_update(khoan_thu_id):
    try:
        payload = request.get_json()
        return update_khoanthu_controller(khoan_thu_id, payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@khoan_thu_bp.route("/<int:khoan_thu_id>", methods=["DELETE"])
@role_required(ROLE_KE_TOAN)
def route_delete(khoan_thu_id):
    return delete_khoanthu_controller(khoan_thu_id)

