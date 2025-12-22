from ..extensions import db

class KhoanThu(db.Model):
    __tablename__ = "khoan_thu"

    id = db.Column(db.Integer, primary_key=True)
    ten_khoan_thu = db.Column(db.String(100), nullable=False)
    so_tien = db.Column(db.Numeric(12, 2), nullable=False)
    bat_buoc = db.Column(db.Boolean, nullable=False)
    ghi_chu = db.Column(db.Text)

    nop_tien = db.relationship("NopTien", back_populates="khoan_thu", cascade="all, delete-orphan")

