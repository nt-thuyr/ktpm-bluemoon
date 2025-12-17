from ..extensions import db

class HoKhau(db.Model):
    __tablename__ = "ho_khau"

    so_ho_khau = db.Column(db.Integer, primary_key=True)
    so_nha = db.Column(db.String(50))
    duong = db.Column(db.String(50))
    phuong = db.Column(db.String(50))
    quan = db.Column(db.String(50))
    ngay_lam_ho_khau = db.Column(db.Date)
    dien_tich = db.Column(db.Numeric(10, 2), default=0)

    chu_ho_id = db.Column(db.Integer, db.ForeignKey("nhan_khau.id"), nullable=False, unique=True)

    chu_ho = db.relationship("NhanKhau", back_populates="ho_khau_chu")

    thanh_vien_ho = db.relationship("NhanKhau", foreign_keys="NhanKhau.ho_khau_id", back_populates="ho_khau", lazy=True)

    nop_tien = db.relationship("NopTien", back_populates="ho_khau", cascade="all, delete-orphan")
    lich_su_ho_khau = db.relationship("LichSuHoKhau", back_populates="ho_khau", cascade="all, delete-orphan")
