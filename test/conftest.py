import sys
import pathlib
import pytest

# Ensure app package (src/backend) is on path
ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src' / 'backend'))

from src.backend.app import create_app
from src.backend.app.extensions import db
from src.backend.app.services.auth_service import create_user


# 1. Tạo cấu hình riêng cho môi trường Test
class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Dùng RAM, không đụng vào PostgreSQL
    JWT_SECRET_KEY = 'test-secret'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


@pytest.fixture()
def app():
    # 2. Truyền config vào đây để khởi tạo app với SQLite ngay lập tức
    app = create_app(config_class=TestConfig)

    with app.app_context():
        db.create_all()  # Tạo bảng trong RAM

        # Seed basic users (Tạo dữ liệu mẫu)
        create_user('to_truong', 'password', 'Tổ trưởng', 'Nguyen To')
        create_user('ke_toan', 'password', 'Kế toán', 'Nguyen Ke')

        db.session.commit()

        yield app

        # Dọn dẹp sau khi test xong
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def token_to_truong(client):
    resp = client.post('/api/auth/dang-nhap', json={'username': 'to_truong', 'password': 'password'})
    # Kiểm tra xem login có thành công không trước khi lấy token để tránh lỗi NoneType
    if resp.status_code != 200:
        raise RuntimeError(f"Login failed for setup: {resp.get_json()}")
    return resp.get_json().get('access_token')


@pytest.fixture()
def token_ke_toan(client):
    resp = client.post('/api/auth/dang-nhap', json={'username': 'ke_toan', 'password': 'password'})
    if resp.status_code != 200:
        raise RuntimeError(f"Login failed for setup: {resp.get_json()}")
    return resp.get_json().get('access_token')