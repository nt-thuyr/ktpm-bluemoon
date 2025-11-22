# Demo để test API, chưa check user và role 
# Todo: Login & decorators

from flask import Blueprint, request, jsonify
from ..controllers.nhan_khau_controller import (
    get_all_nhankhau_controller,
    get_nhankhau_by_id_controller,
    create_nhankhau_controller,
    update_nhankhau_controller,
    delete_nhankhau_controller
)

nhan_khau_bp = Blueprint("nhan_khau", __name__)

@nhan_khau_bp.route("/", methods=["GET"])
def route_get_all():
    return get_all_nhankhau_controller()

@nhan_khau_bp.route("/<int:id>", methods=["GET"])
def route_get_by_id(id):
    return get_nhankhau_by_id_controller(id)

@nhan_khau_bp.route("/", methods=["POST"])
def route_create():
    try:
        payload = request.get_json() # get_json() an toàn hơn .json
        return create_nhankhau_controller(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@nhan_khau_bp.route("/<int:id>", methods=["PUT"])
def route_update(id):
    try:
        payload = request.get_json()
        return update_nhankhau_controller(id, payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@nhan_khau_bp.route("/<int:id>", methods=["DELETE"])
def route_delete(id):
    return delete_nhankhau_controller(id)