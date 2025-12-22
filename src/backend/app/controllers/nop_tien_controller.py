from flask import jsonify
from ..services.nop_tien_service import (
    get_list_noptien,
    get_noptien_by_id,
    get_noptien_by_ho_khau,
    get_noptien_by_khoan_thu,
    create_noptien,
    delete_noptien,
)

def get_all_noptien_controller():
    data = get_list_noptien()
    return jsonify(data), 200

def get_noptien_by_id_controller(nop_tien_id):
    data = get_noptien_by_id(nop_tien_id)
    if not data:
        return jsonify({"message": "Không tìm thấy bản ghi nộp tiền"}), 404
    return jsonify(data), 200

def get_noptien_by_ho_khau_controller(ho_khau_id):
    data = get_noptien_by_ho_khau(ho_khau_id)
    return jsonify(data), 200

def get_nop_tien_by_khoan_thu_controller(khoan_thu_id):
    data = get_noptien_by_khoan_thu(khoan_thu_id)
    return jsonify(data), 200

def create_noptien_controller(payload):
    if not payload:
        return jsonify({"message": "Dữ liệu không hợp lệ"}), 400

    result = create_noptien(payload)

    if result == "invalid":
        return jsonify({"message": "Thiếu thông tin bắt buộc"}), 400

    if result == "error":
        return jsonify({"message": "Lỗi hệ thống hoặc dữ liệu không hợp lệ"}), 500

    return jsonify(result), 201

def delete_noptien_controller(nop_tien_id):
    success = delete_noptien(nop_tien_id)

    if not success:
        return jsonify({"message": "Không tìm thấy bản ghi để xóa"}), 404

    return jsonify({"message": "Đã xóa thành công"}), 200
