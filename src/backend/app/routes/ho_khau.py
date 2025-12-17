from flask import Blueprint, request, jsonify
from ..controllers.ho_khau_controller import (
    get_all_hokhau_controller,
    get_hokhau_by_id_controller,
    create_hokhau_controller,
    update_hokhau_controller,
    delete_hokhau_controller,
    tach_hokhau_controller
)

ho_khau_bp = Blueprint("ho_khau", __name__)

@ho_khau_bp.route("/", methods=["GET"])
def route_get_all():
    return get_all_hokhau_controller()

@ho_khau_bp.route("/<int:id>", methods=["GET"])
def route_get_by_id(id):
    return get_hokhau_by_id_controller(id)

@ho_khau_bp.route("/", methods=["POST"])
def route_create():
    try:
        payload = request.get_json()  # get_json() an toàn hơn .json
        return create_hokhau_controller(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ho_khau_bp.route("/<int:id>", methods=["PUT"])
def route_update(id):
    try:
        payload = request.get_json()
        return update_hokhau_controller(id, payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ho_khau_bp.route("/<int:id>", methods=["DELETE"])
def route_delete(id):
    return delete_hokhau_controller(id)

@ho_khau_bp.route("/tach-ho", methods=["POST"])
def route_tach_ho():
    try:
        payload = request.get_json()
        return tach_hokhau_controller(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500