from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    # Dùng ID tự tăng làm khóa chính (tốt cho DB relationship)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    vai_tro = db.Column(db.String(50), nullable=False)
    ho_ten = db.Column(db.String(100))
    ngay_tao = db.Column(db.Date, default=datetime.now)

    def set_password(self, raw_password: str):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password, raw_password)