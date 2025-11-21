# Demo để test API, chưa check user và role 
# Todo: Login & decorators

from flask import Blueprint, request, jsonify
from app.controllers.nhan_khau_controller import (
    get_all_nhankhau_controller,
    get_nhankhau_by_id_controller,
    create_nhankhau_controller,
    update_nhankhau_controller,
    delete_nhankhau_controller
)

nhan_khau_bp = Blueprint("nhan_khau", __name__)

# GET all
@nhan_khau_bp.route("/", methods=["GET"])
def route_get_all():
    return get_all_nhankhau_controller()

# GET by ID
@nhan_khau_bp.route("/<int:id>", methods=["GET"])
def route_get_by_id(id):
    return get_nhankhau_by_id_controller(id)

# POST
@nhan_khau_bp.route("/", methods=["POST"])
def route_create():
    payload = request.json
    return create_nhankhau_controller(payload)

# PUT
@nhan_khau_bp.route("/<int:id>", methods=["PUT"])
def route_update(id):
    payload = request.json
    return update_nhankhau_controller(id, payload)

# DELETE
@nhan_khau_bp.route("/<int:id>", methods=["DELETE"])
def route_delete(id):
    return delete_nhankhau_controller(id)
