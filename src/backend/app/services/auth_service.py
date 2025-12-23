from ..extensions import db
from ..models.user import User
from ..utils.constants import ALLOWED_ROLES
from sqlalchemy.exc import IntegrityError
from datetime import datetime


def create_user(username, password, vai_tro, ho_ten=None):
    # Validate vai trò
    if vai_tro not in ALLOWED_ROLES:
        return None  # Hoặc raise Exception tùy cách xử lý lỗi

    # Kiểm tra username đã tồn tại chưa
    if User.query.filter_by(username=username).first():
        return None

    u = User(username=username, vai_tro=vai_tro, ho_ten=ho_ten)
    u.set_password(password)

    try:
        db.session.add(u)
        db.session.commit()
        return serialize_user(u)
    except IntegrityError:
        db.session.rollback()
        return None


def authenticate_user(username, password):
    u = User.query.filter_by(username=username).first()
    if not u:
        return None
    if u.check_password(password):
        return u
    return None


def change_password(username, current_password, new_password):
    u = User.query.filter_by(username=username).first()
    if not u:
        return "not_found"
    if not u.check_password(current_password):
        return "wrong_current"

    # Validate độ dài pass mới (ví dụ đơn giản)
    if len(new_password) < 6:
        return "weak_password"

    u.set_password(new_password)
    db.session.commit()
    return True


def update_user(username, data):
    # Tìm user theo username (hoặc nên sửa controller để gửi ID xuống thì tốt hơn)
    u = User.query.filter_by(username=username).first()
    if not u:
        return None

    # Chỉ update vai trò nếu hợp lệ
    if "vai_tro" in data:
        if data["vai_tro"] in ALLOWED_ROLES:
            u.vai_tro = data["vai_tro"]

    if "ho_ten" in data:
        u.ho_ten = data["ho_ten"]

    # CẢI TIẾN: Chỉ admin đổi pass ở đây, cần kiểm tra kỹ
    if "password" in data and data["password"]:
        if len(str(data["password"])) >= 6:
            u.set_password(data["password"])

    try:
        db.session.commit()
        return serialize_user(u)
    except IntegrityError:
        db.session.rollback()
        return None


def delete_user(username):
    u = User.query.filter_by(username=username).first()
    if not u:
        return False
    db.session.delete(u)
    db.session.commit()
    return True


def get_all_users():
    users = User.query.all()
    return [serialize_user(u) for u in users]


def get_user(username):
    u = User.query.filter_by(username=username).first()
    return serialize_user(u) if u else None


def serialize_user(u: User):
    return {
        "id": u.id,
        "username": u.username,
        "ho_ten": u.ho_ten,
        "vai_tro": u.vai_tro,
        "ngay_tao": str(u.ngay_tao) if u.ngay_tao else None
    }