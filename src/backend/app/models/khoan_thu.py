from ..extensions import db
from datetime import datetime

class KhoanThu(db.Model):
    __tablename__ = "khoan_thu"

    id = db.Column(db.Integer, primary_key=True)
    ten_khoan_thu = db.Column(db.String(100), nullable=False)
    so_tien = db.Column(db.Numeric(12, 2), nullable=False)  # Dùng Numeric cho tiền tệ chính xác hơn Float
    # True: bắt buộc, False: tự nguyện
    bat_buoc = db.Column(db.Boolean, nullable=False, default=True)
    ghi_chu = db.Column(db.Text)
    ngay_tao = db.Column(db.Date, default=datetime.now().date)
    thoi_han = db.Column(db.Date, nullable=True)  # Có thể null nếu là khoản đóng góp tự nguyện dài hạn

    # Quan hệ
    nop_tien = db.relationship("NopTien", back_populates="khoan_thu", lazy=True)