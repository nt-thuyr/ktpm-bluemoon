from flask import jsonify, request
from ..services.nhan_khau_service import (
    search_nhankhau_global,
    get_nhankhau_by_id,
    create_nhankhau,
    update_nhankhau,
    delete_nhankhau
)


def get_all_nhankhau_controller():
    # Lấy keyword từ URL (VD: ?keyword=Tuan hoặc ?keyword=1206)
    keyword = request.args.get("keyword", "")

    # Luôn dùng hàm search global
    data = search_nhankhau_global(keyword)

    return jsonify({
        "message": "Lấy danh sách thành công",
        "count": len(data),
        "data": data
    }), 200


def get_nhankhau_by_id_controller(id):
    data = get_nhankhau_by_id(id)
    if not data:
        return jsonify({"message": "Không tìm thấy nhân khẩu"}), 404
    return jsonify(data), 200


def create_nhankhau_controller(payload):
    # Validate cơ bản
    if not payload or not payload.get("HoTen"):
        return jsonify({"message": "Họ tên là bắt buộc"}), 400

    # Validate CCCD (Demo)
    if payload.get("cccd") and len(payload.get("cccd")) < 9:
        return jsonify({"message": "CCCD/CMND không hợp lệ"}), 400

    result = create_nhankhau(payload)

    if result is None:
        return jsonify({"message": "Tạo thất bại. CCCD có thể đã tồn tại."}), 409

    return jsonify({
        "message": "Thêm nhân khẩu thành công",
        "data": result
    }), 201


def update_nhankhau_controller(id, payload):
    result = update_nhankhau(id, payload)

    if result is None:
        return jsonify({"message": "Không tìm thấy nhân khẩu để sửa"}), 404

    if result == "conflict":
        return jsonify({"message": "Cập nhật thất bại. CCCD trùng lặp."}), 409

    return jsonify({
        "message": "Cập nhật thành công",
        "data": result
    }), 200


def delete_nhankhau_controller(id):
    result = delete_nhankhau(id)

    if result == "is_chu_ho":
        # Báo lỗi 400 nếu cố xóa chủ hộ
        return jsonify({
            "message": "Không thể xóa người này vì họ đang là Chủ Hộ. Vui lòng thay đổi chủ hộ hoặc xóa cả hộ khẩu."
        }), 400

    if not result:
        return jsonify({"message": "Không tìm thấy nhân khẩu"}), 404

    return jsonify({"message": "Đã xóa nhân khẩu thành công"}), 200