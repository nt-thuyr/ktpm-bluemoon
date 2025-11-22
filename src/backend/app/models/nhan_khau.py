from ..extensions import db


class NhanKhau(db.Model):
    # 1. Tên bảng
    __tablename__ = "nhan_khau"

    id = db.Column(db.Integer, primary_key=True)

    # 2. Tên cột (Attributes)
    ho_ten = db.Column(db.String(100), nullable=False)
    ngay_sinh = db.Column(db.Date)
    gioi_tinh = db.Column(db.String(10))
    dan_toc = db.Column(db.String(30))
    ton_giao = db.Column(db.String(30))
    cccd = db.Column(db.String(20), unique=True)
    ngay_cap = db.Column(db.Date)
    noi_cap = db.Column(db.String(100))
    nghe_nghiep = db.Column(db.String(100))
    ghi_chu = db.Column(db.Text)

    # 3. Relationships
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