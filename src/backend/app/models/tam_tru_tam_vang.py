from ..extensions import db


class TamTruTamVang(db.Model):
    __tablename__ = "tam_tru_tam_vang"

    id = db.Column(db.Integer, primary_key=True)

    nhan_khau_id = db.Column(db.Integer, db.ForeignKey("nhan_khau.id"), nullable=False)

    trang_thai = db.Column(db.String(20), nullable=False)
    dia_chi = db.Column(db.String(100))
    thoi_gian = db.Column(db.Date, nullable=False)
    noi_dung_de_nghi = db.Column(db.Text)

    nhan_khau = db.relationship("NhanKhau", back_populates="tam_tru_tam_vang")