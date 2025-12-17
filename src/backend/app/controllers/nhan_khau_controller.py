from flask import jsonify
from ..services.nhan_khau_service import (
    get_all_nhankhau, get_nhankhau_by_id,
    create_nhankhau, update_nhankhau, delete_nhankhau
)

def get_all_nhankhau_controller():
    data = get_all_nhankhau()
    return jsonify({
        "message": "Lấy danh sách thành công",
        "count": len(data),
        "data": data
    }), 200


def get_nhankhau_by_id_controller(id):
    data = get_nhankhau_by_id(id)
    if not data:
        return jsonify({"message": "Không tìm thấy nhân khẩu với ID này"}), 404
    return jsonify(data), 200


def create_nhankhau_controller(payload):
    # 1. Validate bắt buộc
    if not payload or not payload.get("HoTen"):
        return jsonify({"message": "Họ tên là bắt buộc"}), 400

    # 2. Validate logic (Ví dụ)
    # Nếu có CCCD thì phải đủ độ dài (ví dụ đơn giản)
    if payload.get("cccd") and len(payload.get("cccd")) < 9:
        return jsonify({"message": "CCCD/CMND không hợp lệ"}), 400

    result = create_nhankhau(payload)

    if result is None:
        # Thường do trùng Unique Key (CCCD)
        return jsonify({"message": "Tạo thất bại. Có thể số CCCD đã tồn tại."}), 409

    return jsonify({
        "message": "Thêm nhân khẩu thành công",
        "data": result
    }), 201


def update_nhankhau_controller(id, payload):
    result = update_nhankhau(id, payload)

    if result is None:
        return jsonify({"message": "Không tìm thấy nhân khẩu để sửa"}), 404

    if result == "conflict":
        return jsonify({"message": "Cập nhật thất bại. CCCD bị trùng với người khác."}), 409

    return jsonify({
        "message": "Cập nhật thành công",
        "data": result
    }), 200


def delete_nhankhau_controller(id):
    success = delete_nhankhau(id)
    if not success:
        return jsonify({"message": "Không tìm thấy nhân khẩu hoặc lỗi server"}), 404
    return jsonify({"message": "Đã xóa nhân khẩu thành công"}), 200