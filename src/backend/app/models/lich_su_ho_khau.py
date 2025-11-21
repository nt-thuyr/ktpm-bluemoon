from app.extensions import db

class LichSuHoKhau(db.Model):
    __tablename__ = "lichsuhokhau"

    id = db.Column(db.Integer, primary_key=True)
    NhanKhauId = db.Column(db.Integer, db.ForeignKey("nhankhau.id"), nullable=False)
    HoKhauId = db.Column(db.Integer, db.ForeignKey("hokhau.SoHoKhau"), nullable=False)
    LoaiThayDoi = db.Column(db.Integer, nullable=False)
    ThoiGian = db.Column(db.Date, nullable=False)

    nhan_khau = db.relationship("NhanKhau", back_populates="lich_su_ho_khau")
    ho_khau = db.relationship("HoKhau", back_populates="lich_su_ho_khau")
