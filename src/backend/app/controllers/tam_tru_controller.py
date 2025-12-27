from flask import jsonify, request
from ..services.tam_tru_service import (
    create_tamtru,
    get_all_tamtru_global,
    delete_tamtru, update_tamtru
)


def get_all_tamtru_controller():
    # Hỗ trợ search global: ?keyword=Tuan
    keyword = request.args.get("keyword", "")
    data = get_all_tamtru_global(keyword)

    return jsonify({
        "message": "Lấy danh sách thành công",
        "count": len(data),
        "data": data
    }), 200


def create_tamtru_controller(payload):
    if not payload or "nhan_khau_id" not in payload:
        return jsonify({"message": "Thiếu ID nhân khẩu"}), 400

    result = create_tamtru(payload)

    if result == "nhan_khau_not_found":
        return jsonify({"message": "Nhân khẩu không tồn tại"}), 404

    if result == "tam_vang_requires_hokhau":
        return jsonify({
            "message": "Không thể đăng ký Tạm vắng cho người chưa có Hộ khẩu tại đây."
        }), 400

    if result == "invalid_date":
        return jsonify({"message": "Định dạng ngày tháng không hợp lệ (YYYY-MM-DD)"}), 400

    if result is None:
        return jsonify({"message": "Tạo thất bại. Lỗi server."}), 500

    return jsonify({
        "message": "Đăng ký thành công",
        "data": result
    }), 201


def update_tamtru_controller(id, payload):
    if not payload:
        return jsonify({"message": "Dữ liệu gửi lên không hợp lệ"}), 400

    result = update_tamtru(id, payload)

    if result is None:
        return jsonify({"message": "Không tìm thấy bản ghi tạm trú/tạm vắng"}), 404

    if result == "invalid_date":
        return jsonify({"message": "Định dạng ngày tháng không hợp lệ (YYYY-MM-DD)"}), 400

    if result == "tam_vang_requires_hokhau":
        return jsonify({
            "message": "Không thể chuyển sang Tạm vắng vì người này chưa có Hộ khẩu tại đây."
        }), 400

    if result == "conflict":
        return jsonify({"message": "Lỗi hệ thống khi cập nhật dữ liệu"}), 500

    return jsonify({
        "message": "Cập nhật thông tin thành công",
        "data": result
    }), 200

def delete_tamtru_controller(id):
    if delete_tamtru(id):
        return jsonify({"message": "Xóa thành công"}), 200
    return jsonify({"message": "Không tìm thấy bản ghi"}), 404