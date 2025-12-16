from flask import jsonify, request
from ..services.phai_dong_service import (
    get_phai_dong_by_khoan_thu,
    get_phai_dong_by_ho_khau,
    get_phai_dong_qua_han,
    gia_han_phai_dong
)

def get_phai_dong_controller():
    khoan_thu_id = request.args.get("khoanThuId", type=int)
    ho_khau_id = request.args.get("hoKhauId", type=int)

    if khoan_thu_id:
        return jsonify(get_phai_dong_by_khoan_thu(khoan_thu_id)), 200

    if ho_khau_id:
        return jsonify(get_phai_dong_by_ho_khau(ho_khau_id)), 200

    return jsonify({"message": "Thiếu tham số truy vấn"}), 400


def get_phai_dong_qua_han_controller():
    return jsonify(get_phai_dong_qua_han()), 200


def gia_han_phai_dong_controller(payload):
    ho_khau_id = payload.get("HoKhauId")
    khoan_thu_id = payload.get("KhoanThuId")
    han_nop_moi = payload.get("HanNop")

    if not ho_khau_id or not khoan_thu_id or not han_nop_moi:
        return jsonify({"message": "Thiếu thông tin gia hạn"}), 400

    result = gia_han_phai_dong(ho_khau_id, khoan_thu_id, han_nop_moi)

    if result is None:
        return jsonify({"message": "Không tìm thấy khoản thu phải đóng"}), 404

    if result == "invalid":
        return jsonify({"message": "Hạn nộp không hợp lệ"}), 400

    return jsonify(result), 200
