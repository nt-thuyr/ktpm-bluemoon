from flask import jsonify, request
from ..services.ho_khau_service import (
    get_hokhau_by_id, search_hokhau_global,
    create_hokhau, update_hokhau, delete_hokhau, get_lich_su_ho_khau
)


def get_all_hokhau_controller():
    # Lấy keyword từ param URL. Ví dụ: GET /api/hokhau?keyword=Tuan
    # Nếu không có keyword, mặc định là chuỗi rỗng ""
    keyword = request.args.get("keyword", "")

    # Luôn gọi hàm search global.
    # (Bên trong service đã có logic: nếu keyword rỗng -> trả về tất cả)
    data = search_hokhau_global(keyword)

    return jsonify({
        "message": "Lấy dữ liệu thành công",
        "count": len(data),
        "data": data
    }), 200


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
        return jsonify({"message": "ID Chủ hộ không tồn tại"}), 404

    if result is None:
        return jsonify({"message": "Tạo thất bại. Kiểm tra lại dữ liệu"}), 409
    return jsonify(result), 201


def update_hokhau_controller(id, payload):
    result = update_hokhau(id, payload)
    if result is None:
        return jsonify({"message": "Không tìm thấy hộ khẩu"}), 404
    if result == "conflict":
        return jsonify({"message": "Lỗi dữ liệu (trùng lặp)"}), 409

    return jsonify(result), 200


def delete_hokhau_controller(id):
    result = delete_hokhau(id)

    if result == "has_members":
        # Trả về 400 Bad Request vì vi phạm quy tắc nghiệp vụ
        return jsonify({
            "message": "Không thể xóa hộ khẩu này vì vẫn còn thành viên. Vui lòng tách hộ hoặc xóa thành viên trước."
        }), 400

    if not result:
        return jsonify({"message": "Không tìm thấy hộ khẩu để xóa"}), 404

    return jsonify({"message": "Đã xóa thành công"}), 200

def get_lich_su_controller(ho_khau_id):
    result = get_lich_su_ho_khau(ho_khau_id)
    if result is None:
        return jsonify({"message": "Không tìm thấy hộ khẩu"}), 404

    return jsonify({
        "SoHoKhau": ho_khau_id,
        "LichSu": result
    }), 200