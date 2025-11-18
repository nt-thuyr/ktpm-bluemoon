from flask import Blueprint, request, jsonify, current_app
from ..services.data_service import find_user_by_username
from ..services.auth_service import create_token, decode_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'username and password required'}), 400

    user = find_user_by_username(username)
    if not user or user.get('password') != password:
        return jsonify({'message': 'invalid credentials'}), 401

    token = create_token(user)
    return jsonify({'access_token': token, 'role': user['role']})


@auth_bp.route('/verify', methods=['GET'])
def verify():
    # simple token verify endpoint
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return jsonify({'message': 'missing token'}), 401
    token = auth.split(' ', 1)[1]
    user, info = decode_token(token)
    if not user:
        return jsonify({'message': 'token invalid', 'info': info}), 401
    return jsonify({'user': {'id': user['id'], 'username': user['username'], 'role': user['role']}})
