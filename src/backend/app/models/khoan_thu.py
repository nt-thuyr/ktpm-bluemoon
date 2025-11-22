from ..extensions import db

class KhoanThu(db.Model):
    __tablename__ = "khoan_thu"

    id = db.Column(db.Integer, primary_key=True)
    ngay_tao = db.Column(db.Date, nullable=False)
    thoi_han = db.Column(db.Date)
    ten_khoan_thu = db.Column(db.String(100), nullable=False)
    ban_buoc = db.Column(db.Boolean, nullable=False)
    ghi_chu = db.Column(db.Text)

    nop_tien = db.relationship("NopTien", back_populates="khoan_thu", cascade="all, delete-orphan")