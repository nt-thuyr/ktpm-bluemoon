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

    # Quan hệ 1-n: Hộ khẩu chứa Nhân khẩu
    ho_khau_id = db.Column(db.Integer, db.ForeignKey("ho_khau.so_ho_khau", use_alter=True))
    ngay_them_nhan_khau = db.Column(db.Date)  # ngaythemnhankhau
    quan_he_voi_chu_ho = db.Column(db.String(50))  # quanhevoichuho
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

    # 1. Quan hệ thành viên (Người này thuộc hộ khẩu nào?)
    # Cần thêm cái này vì bên HoKhau dùng back_populates="ho_khau"
    ho_khau = db.relationship(
        "HoKhau",
        foreign_keys=[ho_khau_id],  # <--- Chỉ định dùng khóa ngoại ho_khau_id
        back_populates="thanh_vien_ho"
    )

    # 2. Quan hệ chủ hộ (Người này làm chủ hộ cho hộ khẩu nào?)
    ho_khau_chu = db.relationship(
        "HoKhau",
        foreign_keys="HoKhau.chu_ho_id",  # <--- Chỉ định dùng khóa ngoại bên bảng HoKhau
        back_populates="chu_ho",
        uselist=False
    )