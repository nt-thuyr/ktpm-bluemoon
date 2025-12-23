from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..controllers.auth_controller import (
    login_controller, logout_controller, change_password_controller,
    list_users_controller, get_user_controller,
    create_user_controller, update_user_controller, delete_user_controller
)
from ..utils.decorators import role_required
from ..utils.constants import ROLE_TO_TRUONG

auth_bp = Blueprint("auth", __name__)

# --- Authentication ---
@auth_bp.route("/dang-nhap", methods=["POST"])
def route_login():
    return login_controller(request.get_json())

@auth_bp.route("/dang-xuat", methods=["DELETE"])
@jwt_required()
def route_logout():
    return logout_controller()

@auth_bp.route("/doi-mat-khau", methods=["POST"])
@jwt_required()
def route_change_password():
    current_user = get_jwt_identity()
    return change_password_controller(current_user, request.get_json())

# --- User Management (CRUD) ---
@auth_bp.route("/users", methods=["GET"])
@role_required(ROLE_TO_TRUONG)
def route_list_users():
    return list_users_controller()

@auth_bp.route("/users", methods=["POST"])
@role_required(ROLE_TO_TRUONG)
def route_create_user():
    return create_user_controller(request.get_json())

@auth_bp.route("/users/<string:username>", methods=["PUT"])
@role_required(ROLE_TO_TRUONG)
def route_update_user(username):
    return update_user_controller(username, request.get_json())

@auth_bp.route("/users/<string:username>", methods=["GET"])
@role_required(ROLE_TO_TRUONG)
def route_get_user(username):
    return get_user_controller(username)

@auth_bp.route("/users/<string:username>", methods=["DELETE"])
@role_required(ROLE_TO_TRUONG)
def route_delete_user(username):
    return delete_user_controller(username)