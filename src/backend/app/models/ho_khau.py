from ..extensions import db

class HoKhau(db.Model):
    __tablename__ = "ho_khau"

    so_ho_khau = db.Column(db.Integer, primary_key=True)
    so_nha = db.Column(db.String(50))
    duong = db.Column(db.String(50))
    phuong = db.Column(db.String(50))
    quan = db.Column(db.String(50))
    ngay_lam_ho_khau = db.Column(db.Date)

    chu_ho_id = db.Column(db.Integer, db.ForeignKey("nhan_khau.id", use_alter=True), nullable=False, unique=True)

    # 1. Quan hệ Chủ hộ (Ai là chủ cái hộ này?)
    chu_ho = db.relationship(
        "NhanKhau",
        foreign_keys=[chu_ho_id],
        back_populates="ho_khau_chu"
    )

    # 2. Quan hệ Thành viên (Những ai thuộc hộ này?)
    thanh_vien_ho = db.relationship(
        "NhanKhau",
        foreign_keys="NhanKhau.ho_khau_id",
        back_populates="ho_khau",
        lazy=True
    )

    nop_tien = db.relationship("NopTien", back_populates="ho_khau", cascade="all, delete-orphan")
    lich_su_ho_khau = db.relationship("LichSuHoKhau", back_populates="ho_khau", cascade="all, delete-orphan")
