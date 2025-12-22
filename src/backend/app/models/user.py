# src/backend/app/models/user.py

from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash  # <--- QUAN TRỌNG
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    ho_ten = db.Column(db.String(100))
    vai_tro = db.Column(db.String(20), nullable=False)
    ngay_tao = db.Column(db.DateTime, default=datetime.utcnow)

    # Hàm mã hóa mật khẩu
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Hàm kiểm tra mật khẩu
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # (Tùy chọn) Hàm __repr__ để debug dễ hơn
    def __repr__(self):
        return f"<User {self.username}>"