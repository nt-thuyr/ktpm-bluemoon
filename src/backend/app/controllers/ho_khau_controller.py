from flask import jsonify
from ..services.ho_khau_service import (
    get_all_hokhau, get_all_hokhau_by_id,
    create_hokhau, update_hokhau, delete_hokhau
)

def get_all_hokhau_controller():
    data = get_all_hokhau()
    return jsonify(data), 200

def get_hokhau_by_id_controller(id):
    data = get_all_hokhau_by_id(id)
    if not data:
        return jsonify({"message": "Không tìm thấy hộ khẩu"}), 404
    return jsonify(data), 200

def create_hokhau_controller(payload):
    # TODO: validate nang cao
    if not payload:
        return jsonify({"message": "Dữ liệu không hợp lệ"}), 400

    result = create_hokhau(payload)
    if result is None:
        return jsonify({"message": "Dữ liệu không hợp lệ hoặc trùng lặp"}), 409
    return jsonify(result), 201

def update_hokhau_controller(id, payload):
    result = update_hokhau(id, payload)
    if result is None:
        return jsonify({"message": "Không tìm thấy hộ khẩu để sửa"}), 404
    if result == "conflict":
        return jsonify({"message": "Thông tin cập nhật bị trùng lặp"}), 409

    return jsonify(result), 200

def delete_hokhau_controller(id):
    success = delete_hokhau(id)
    if not success:
        return jsonify({"message": "Không tìm thấy hộ khẩu để xóa"}), 404
    return jsonify({"message": "Đã xóa thành công"}), 200