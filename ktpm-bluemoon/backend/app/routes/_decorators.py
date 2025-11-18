from functools import wraps
from flask import request, jsonify
from ..services.auth_service import decode_token


def get_user_from_header():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None, 'missing_token'
    token = auth.split(' ', 1)[1]
    user, info = decode_token(token)
    if not user:
        return None, info
    return user, None


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user, err = get_user_from_header()
        if not user:
            return jsonify({'message': 'authentication required', 'detail': err}), 401
        return f(user, *args, **kwargs)
    return wrapper


def role_required(roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user, err = get_user_from_header()
            if not user:
                return jsonify({'message': 'authentication required', 'detail': err}), 401
            if user.get('role') not in roles:
                return jsonify({'message': 'forbidden: role not allowed'}), 403
            return f(user, *args, **kwargs)
        return wrapper
    return decorator
