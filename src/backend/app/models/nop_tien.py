from ..extensions import db

class NopTien(db.Model):
    __tablename__ = "nop_tien"

    id = db.Column(db.Integer, primary_key=True)

    ho_khau_id = db.Column(
        db.Integer,
        db.ForeignKey("ho_khau.so_ho_khau"),
        nullable=False
    )
    khoan_thu_id = db.Column(
        db.Integer,
        db.ForeignKey("khoan_thu.id"),
        nullable=False
    )

    so_tien = db.Column(db.Numeric(12,2), nullable=False)
    ngay_nop = db.Column(db.Date, nullable=False)
    nguoi_nop = db.Column(db.String(50))

    ho_khau = db.relationship("HoKhau", back_populates="nop_tien")
    khoan_thu = db.relationship("KhoanThu", back_populates="nop_tien")
