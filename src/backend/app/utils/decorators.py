from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def role_required(*allowed_roles):
    """Decorator to require JWT and that user's vai_tro is in allowed_roles.
    Usage: @role_required("Tổ trưởng", "Kế toán")
    If allowed_roles is empty, only verifies JWT.
    """
    
    def decorator(fn):

        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt()
            except Exception:
                return jsonify({"message": "Yêu cầu đăng nhập"}), 401

            if not allowed_roles:
                return fn(*args, **kwargs)

            user_role = claims.get("vai_tro")
        

            if not user_role:
                return jsonify({"message": "Vai trò người dùng không xác định"}), 403

            if user_role not in allowed_roles:
                return jsonify({"message": "Không đủ quyền truy cập"}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator

