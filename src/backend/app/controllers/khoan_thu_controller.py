from flask import jsonify
from ..services.khoan_thu_service import (
    get_all_khoanthu,
    get_khoanthu_by_id,
    create_khoanthu,
    update_khoanthu,
    delete_khoanthu,
)

def get_all_khoanthu_controller():
    data = get_all_khoanthu()
    return jsonify(data), 200

def get_khoanthu_by_id_controller(khoan_thu_id):
    data = get_khoanthu_by_id(khoan_thu_id)
    if not data:
        return jsonify({"message": "Không tìm thấy khoản thu"}), 404
    return jsonify(data), 200

def create_khoanthu_controller(payload):
    if not payload:
        return jsonify({"message": "Dữ liệu không hợp lệ"}), 400

    result = create_khoanthu(payload)

    if result == "invalid":
        return jsonify({"message": "Thiếu thông tin bắt buộc"}), 400

    if result == "conflict":
        return jsonify({"message": "Khoản thu đã tồn tại hoặc dữ liệu không hợp lệ"}), 409

    return jsonify(result), 201

def update_khoanthu_controller(khoan_thu_id, payload):
    if not payload:
        return jsonify({"message": "Dữ liệu không hợp lệ"}), 400

    result = update_khoanthu(khoan_thu_id, payload)

    if result is None:
        return jsonify({"message": "Không tìm thấy khoản thu"}), 404

    if result == "conflict":
        return jsonify({"message": "Cập nhật thất bại do xung đột dữ liệu"}), 409

    return jsonify(result), 200

def delete_khoanthu_controller(khoan_thu_id):
    result = delete_khoanthu(khoan_thu_id)

    if result is False:
        return jsonify({"message": "Không tìm thấy khoản thu"}), 404

    if result == "has_payment":
        return jsonify({
            "message": "Không thể xóa khoản thu đã có bản ghi nộp tiền"
        }), 409

    return jsonify({"message": "Đã xóa khoản thu thành công"}), 200