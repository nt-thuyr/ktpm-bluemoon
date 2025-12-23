from flask import jsonify
from ..services.ho_khau_service import (
    get_all_hokhau, get_hokhau_by_id,
    create_hokhau, update_hokhau, delete_hokhau,
    tach_hokhau
)

def get_all_hokhau_controller():
    data = get_all_hokhau()
    return jsonify(data), 200


def get_hokhau_by_id_controller(id):
    data = get_hokhau_by_id(id)
    if not data:
        return jsonify({"message": "Không tìm thấy hộ khẩu"}), 404
    return jsonify(data), 200


def create_hokhau_controller(payload):
    if not payload or "ChuHoID" not in payload:
        return jsonify({"message": "Thiếu thông tin Chủ hộ"}), 400

    result = create_hokhau(payload)

    if result == "chu_ho_not_found":
        return jsonify({"message": "ID Chủ hộ không tồn tại trong hệ thống nhân khẩu"}), 404

    if result is None:
        return jsonify({"message": "Tạo thất bại. Kiểm tra lại dữ liệu"}), 409
    return jsonify(result), 201


def tach_hokhau_controller(payload):
    # Payload mẫu: {"idHoKhauCu": 1, "idChuHoMoi": 5, "dsThanhVienSangHoMoi": [5,6], "DiaChiMoi": "..."}
    if not payload or "idChuHoMoi" not in payload:
        return jsonify({"message": "Dữ liệu tách hộ không hợp lệ"}), 400

    result = tach_hokhau(payload)
    if result is None:
        return jsonify({"message": "Tách hộ thất bại"}), 500

    return jsonify({
        "message": "Tách hộ thành công",
        "data": result
    }), 201


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