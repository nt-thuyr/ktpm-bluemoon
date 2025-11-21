from app.extensions import db

class KhoanThu(db.Model):
    __tablename__ = "khoanthu"

    id = db.Column(db.Integer, primary_key=True)
    NgayTao = db.Column(db.Date, nullable=False)
    ThoiHan = db.Column(db.Date)
    TenKhoanThu = db.Column(db.String(100), nullable=False)
    BatBuoc = db.Column(db.Boolean, nullable=False)
    GhiChu = db.Column(db.Text)

    nop_tien = db.relationship("NopTien", back_populates="khoan_thu", cascade="all, delete-orphan")