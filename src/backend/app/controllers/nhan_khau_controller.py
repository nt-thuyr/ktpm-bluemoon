from flask import jsonify
from app.services.nhan_khau_service import (
    get_all_nhankhau,
    get_nhankhau_by_id,
    create_nhankhau,
    update_nhankhau,
    delete_nhankhau
)

def get_all_nhankhau_controller():
    data = get_all_nhankhau()
    return jsonify(data), 200


def get_nhankhau_by_id_controller(id):
    data = get_nhankhau_by_id(id)
    if not data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(data), 200


def create_nhankhau_controller(payload):
    result = create_nhankhau(payload)
    return jsonify(result), 201


def update_nhankhau_controller(id, payload):
    result = update_nhankhau(id, payload)
    return jsonify(result), 200


def delete_nhankhau_controller(id):
    delete_nhankhau(id)
    return jsonify({"message": "Deleted"}), 200
