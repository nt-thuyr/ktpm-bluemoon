from app.extensions import db

class NopTien(db.Model):
    __tablename__ = "noptien"

    HoKhauId = db.Column(db.Integer, db.ForeignKey("hokhau.SoHoKhau"), primary_key=True)
    KhoanThuId = db.Column(db.Integer, db.ForeignKey("khoanthu.id"), primary_key=True)

    NguoiNop = db.Column(db.String(100))
    SoTien = db.Column(db.Numeric(12, 2), nullable=False)
    NgayNop = db.Column(db.Date, nullable=False)

    ho_khau = db.relationship("HoKhau", back_populates="nop_tien")
    khoan_thu = db.relationship("KhoanThu", back_populates="nop_tien")
