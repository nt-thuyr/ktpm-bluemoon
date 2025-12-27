from flask import jsonify
from ..services.khoan_thu_service import (
    get_all_khoanthu,
    get_khoanthu_by_id,
    create_khoanthu,
    update_khoanthu,
    delete_khoanthu,
)

# Thêm tham số nhận vào để truyền xuống service
def get_all_khoanthu_controller(tu_ngay=None, den_ngay=None, han_nop=None):
    data = get_all_khoanthu(tu_ngay, den_ngay, han_nop)
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

    if result in ["invalid", "invalid_amount", "invalid_date"]:
        msg = "Dữ liệu không hợp lệ"
        if result == "invalid_date": msg = "Hạn nộp không được nhỏ hơn ngày tạo"
        if result == "invalid_amount": msg = "Số tiền không được âm"
        return jsonify({"message": msg}), 400

    if result == "exists":
        return jsonify({"message": "Tên khoản thu đã tồn tại"}), 409

    if result == "conflict":
        return jsonify({"message": "Lỗi hệ thống khi tạo khoản thu"}), 500

    return jsonify(result), 201

def update_khoanthu_controller(khoan_thu_id, payload):
    if not payload:
        return jsonify({"message": "Dữ liệu không hợp lệ"}), 400

    result = update_khoanthu(khoan_thu_id, payload)

    if result is None:
        return jsonify({"message": "Không tìm thấy khoản thu"}), 404

    if result in ["invalid", "invalid_date"]:
        msg = "Hạn nộp không được nhỏ hơn ngày tạo" if result == "invalid_date" else "Dữ liệu không hợp lệ"
        return jsonify({"message": msg}), 400

    if result == "conflict":
        return jsonify({"message": "Cập nhật thất bại do xung đột dữ liệu"}), 500

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