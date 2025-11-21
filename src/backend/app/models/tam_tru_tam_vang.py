from app.extensions import db

class TamTruTamVang(db.Model):
    __tablename__ = "tamtrutamvang"

    id = db.Column(db.Integer, primary_key=True)
    nhanKhauId = db.Column(db.Integer, db.ForeignKey("nhankhau.id"), nullable=False)
    trangThai = db.Column(db.String(20), nullable=False)
    diaChi = db.Column(db.String(100))
    thoiGian = db.Column(db.Date, nullable=False)
    noiDungDeNghi = db.Column(db.Text)

    nhan_khau = db.relationship("NhanKhau", back_populates="tam_tru_tam_vang")