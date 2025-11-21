from app.extensions import db

class HoKhau(db.Model):
    __tablename__ = "hokhau"

    SoHoKhau = db.Column(db.Integer, primary_key=True)
    SoNha = db.Column(db.String(50))
    Duong = db.Column(db.String(50))
    Phuong = db.Column(db.String(50))
    Quan = db.Column(db.String(50))
    NgayLamHoKhau = db.Column(db.Date)

    ChuHoId = db.Column(
        db.Integer,
        db.ForeignKey("nhankhau.id"),
        nullable=False,
        unique=True
    )

    ChuHoId = db.Column(db.Integer, db.ForeignKey("nhankhau.id"), nullable=False, unique=True)

    chu_ho = db.relationship("NhanKhau", back_populates="ho_khau_chu")

    nop_tien = db.relationship("NopTien", back_populates="ho_khau", cascade="all, delete-orphan")

    lich_su_ho_khau = db.relationship(
        "LichSuHoKhau",
        back_populates="ho_khau",
        cascade="all, delete-orphan"
    )
