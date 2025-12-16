from flask import jsonify
from ..services.khoan_thu_service import (
    get_all_khoan_thu,
    get_khoan_thu_by_id,
    create_khoan_thu,
    update_khoan_thu,
    delete_khoan_thu
)


def get_all_khoan_thu_controller():
    data = get_all_khoan_thu()
    return jsonify(data), 200


def get_khoan_thu_by_id_controller(id):
    data = get_khoan_thu_by_id(id)
    if not data:
        return jsonify({"message": "Không tìm thấy khoản thu"}), 404
    return jsonify(data), 200


def create_khoan_thu_controller(payload):
    if not payload or "TenKhoanThu" not in payload:
        return jsonify({"message": "Thiếu thông tin Tên khoản thu"}), 400

    result = create_khoan_thu(payload)

    if result == "invalid":
        return jsonify({"message": "Dữ liệu không hợp lệ"}), 400

    if result == "conflict":
        return jsonify({"message": "Khoản thu đã tồn tại"}), 409

    return jsonify(result), 201


def update_khoan_thu_controller(id, payload):
    if not payload:
        return jsonify({"message": "Không có dữ liệu cập nhật"}), 400

    result = update_khoan_thu(id, payload)

    if result is None:
        return jsonify({"message": "Không tìm thấy khoản thu để sửa"}), 404

    if result == "conflict":
        return jsonify({"message": "Thông tin cập nhật bị trùng lặp"}), 409

    return jsonify(result), 200


def delete_khoan_thu_controller(id):
    result = delete_khoan_thu(id)

    if result is None:
        return jsonify({"message": "Không tìm thấy khoản thu để xóa"}), 404

    if result == "has_payment":
        return jsonify({"message": "Khoản thu đã phát sinh nộp tiền, không thể xóa"}), 409

    return jsonify({"message": "Đã xóa thành công"}), 200
