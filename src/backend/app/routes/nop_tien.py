from flask import Blueprint, request, jsonify
from ..controllers.nop_tien_controller import (
    get_all_noptien_controller,
    get_noptien_by_id_controller,
    get_noptien_by_ho_khau_controller,
    get_nop_tien_by_khoan_thu_controller,
    create_noptien_controller,
    delete_noptien_controller,
    export_receipt_pdf_controller,
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_KE_TOAN

nop_tien_bp = Blueprint("nop_tien", __name__)

@nop_tien_bp.route("/", methods=["GET"])
@role_required()
def route_get_all():
    return get_all_noptien_controller()

@nop_tien_bp.route("/<int:nop_tien_id>", methods=["GET"])
@role_required()
def route_get_by_id(nop_tien_id):
    return get_noptien_by_id_controller(nop_tien_id)

@nop_tien_bp.route("/ho-khau/<int:ho_khau_id>", methods=["GET"])
@role_required()
def route_get_by_ho_khau(ho_khau_id):
    return get_noptien_by_ho_khau_controller(ho_khau_id)

@nop_tien_bp.route("/khoan-thu/<int:khoan_thu_id>", methods=["GET"])
@role_required()
def route_get_by_khoan_thu(khoan_thu_id):
    return get_nop_tien_by_khoan_thu_controller(khoan_thu_id)

@nop_tien_bp.route("/", methods=["POST"])
@role_required(ROLE_KE_TOAN)
def route_create():
    try:
        payload = request.get_json()
        return create_noptien_controller(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@nop_tien_bp.route("/<int:nop_tien_id>", methods=["DELETE"])
@role_required(ROLE_KE_TOAN)
def route_delete(nop_tien_id):
    return delete_noptien_controller(nop_tien_id)

@nop_tien_bp.route("/<int:nop_tien_id>/pdf", methods=["GET"])
@role_required(ROLE_KE_TOAN)
def route_export_pdf(nop_tien_id):
    return export_receipt_pdf_controller(nop_tien_id)

