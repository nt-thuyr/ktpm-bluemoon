from ..extensions import db

class NopTien(db.Model):
    __tablename__ = "nop_tien"

    ho_khau_id = db.Column(db.Integer, db.ForeignKey("ho_khau.so_ho_khau"), primary_key=True)
    khoan_thu_id = db.Column(db.Integer, db.ForeignKey("khoan_thu.id"), primary_key=True)

    nguoi_nop = db.Column(db.String(100))
    so_tien = db.Column(db.Numeric(12, 2), nullable=False)
    ngay_nop = db.Column(db.Date, nullable=False)

    ho_khau = db.relationship("HoKhau", back_populates="nop_tien")
    khoan_thu = db.relationship("KhoanThu", back_populates="nop_tien")
