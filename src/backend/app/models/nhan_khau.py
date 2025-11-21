from app.extensions import db

class NhanKhau(db.Model):
    __tablename__ = "nhankhau"

    id = db.Column(db.Integer, primary_key=True)
    HoTen = db.Column(db.String(100), nullable=False)
    NgaySinh = db.Column(db.Date)
    GioiTinh = db.Column(db.String(10))
    DanToc = db.Column(db.String(30))
    TonGiao = db.Column(db.String(30))
    cccd = db.Column(db.String(20), unique=True)
    NgayCap = db.Column(db.Date)
    NoiCap = db.Column(db.String(100))
    NgheNghiep = db.Column(db.String(100))
    GhiChu = db.Column(db.Text)

    tam_tru_tam_vang = db.relationship(
        "TamTruTamVang",
        back_populates="nhan_khau",
        cascade="all, delete-orphan"
    )

    lich_su_ho_khau = db.relationship(
        "LichSuHoKhau",
        back_populates="nhan_khau",
        cascade="all, delete-orphan"
    )

    ho_khau_chu = db.relationship(
        "HoKhau",
        back_populates="chu_ho",
        uselist=False
    )
