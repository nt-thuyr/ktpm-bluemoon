from flask import jsonify
from ..services.nhan_khau_service import (
    get_all_nhankhau, get_nhankhau_by_id,
    create_nhankhau, update_nhankhau, delete_nhankhau
)


def get_all_nhankhau_controller():
    data = get_all_nhankhau()
    return jsonify(data), 200


def get_nhankhau_by_id_controller(id):
    data = get_nhankhau_by_id(id)
    if not data:
        return jsonify({"message": "Không tìm thấy nhân khẩu"}), 404
    return jsonify(data), 200


def create_nhankhau_controller(payload):
    # Logic: Validate cơ bản
    # TODO: validate nang cao
    if not payload or "HoTen" not in payload:
        return jsonify({"message": "Thiếu thông tin Họ tên"}), 400

    result = create_nhankhau(payload)
    if result is None:
        return jsonify({"message": "Dữ liệu không hợp lệ hoặc CCCD đã tồn tại"}), 409
    return jsonify(result), 201


def update_nhankhau_controller(id, payload):
    result = update_nhankhau(id, payload)
    if result is None:
        return jsonify({"message": "Không tìm thấy nhân khẩu để sửa"}), 404
    if result == "conflict":
        return jsonify({"message": "Thông tin cập nhật bị trùng lặp (CCCD)"}), 409

    return jsonify(result), 200


def delete_nhankhau_controller(id):
    success = delete_nhankhau(id)
    if not success:
        return jsonify({"message": "Không tìm thấy nhân khẩu để xóa"}), 404
    return jsonify({"message": "Đã xóa thành công"}), 200