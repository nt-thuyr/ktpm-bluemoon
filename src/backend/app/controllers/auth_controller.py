from flask import jsonify
from flask_jwt_extended import create_access_token, get_jwt
from ..services.auth_service import *
from ..extensions import jwt_blocklist  # Import set blocklist


def login_controller(payload):
    if not payload or "username" not in payload or "password" not in payload:
        return jsonify({"message": "Thiếu username hoặc password"}), 400

    u = authenticate_user(payload.get("username"), payload.get("password"))
    if not u:
        return jsonify({"message": "Sai thông tin đăng nhập"}), 401

    # Lưu thêm thông tin vào token nếu cần
    additional_claims = {"vai_tro": u.vai_tro, "ho_ten": u.ho_ten}
    access_token = create_access_token(identity=u.username, additional_claims=additional_claims)

    return jsonify({
        "access_token": access_token,
        "profile": serialize_user(u)
    }), 200


def logout_controller():
    # Lấy JTI (ID của token) hiện tại
    jti = get_jwt()["jti"]
    # Thêm vào danh sách đen -> Token này sẽ vô hiệu
    jwt_blocklist.add(jti)
    return jsonify({"message": "Đăng xuất thành công"}), 200


def change_password_controller(current_username, payload):
    # payload fields: mat_khau_hien_tai, mat_khau_moi
    if not payload or "mat_khau_hien_tai" not in payload or "mat_khau_moi" not in payload:
        return jsonify({"message": "Thiếu dữ liệu đổi mật khẩu"}), 400

    res = change_password(current_username, payload.get("mat_khau_hien_tai"), payload.get("mat_khau_moi"))
    if res == "not_found":
        return jsonify({"message": "Người dùng không tồn tại"}), 404
    if res == "wrong_current":
        return jsonify({"message": "Mật khẩu hiện tại không đúng"}), 403
    if res is True:
        return jsonify({"message": "Đổi mật khẩu thành công"}), 200
    return jsonify({"message": "Lỗi server"}), 500


# --- User management (CRUD) ---
def list_users_controller():
    return jsonify({"count": len(get_all_users()), "data": get_all_users()}), 200


def get_user_controller(username):
    u = get_user(username)
    if not u:
        return jsonify({"message": "Không tìm thấy người dùng"}), 404
    return jsonify(u), 200


def create_user_controller(payload):
    # Validate input cơ bản
    required = ["username", "password", "vai_tro"]
    if not all(k in payload for k in required):
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    res = create_user(payload["username"], payload["password"], payload["vai_tro"], payload.get("ho_ten"))
    if res is None:
        return jsonify({"message": "Tạo thất bại (Username trùng hoặc Role sai)"}), 409
    return jsonify({"message": "Tạo thành công", "data": res}), 201


def update_user_controller(username, payload):
    res = update_user(username, payload)
    if res is None:
        return jsonify({"message": "Cập nhật thất bại"}), 404
    return jsonify({"message": "Cập nhật thành công", "data": res}), 200


def delete_user_controller(username):
    ok = delete_user(username)
    if not ok:
        return jsonify({"message": "Xóa thất bại"}), 404
    return jsonify({"message": "Đã xóa người dùng"}), 200
