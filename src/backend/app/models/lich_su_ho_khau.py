from ..extensions import db

class LichSuHoKhau(db.Model):
    __tablename__ = "lich_su_ho_khau"

    id = db.Column(db.Integer, primary_key=True)
    nhan_khau_id = db.Column(db.Integer, db.ForeignKey("nhan_khau.id", ondelete="CASCADE"), nullable=False)
    ho_khau_id = db.Column(db.Integer, db.ForeignKey("ho_khau.so_ho_khau", ondelete="CASCADE"), nullable=False)
    loai_thay_doi = db.Column(db.Integer, nullable=False) # 1: Vào, 2: Ra
    thoi_gian = db.Column(db.Date, nullable=False)

    nhan_khau = db.relationship("NhanKhau", back_populates="lich_su_ho_khau")
    ho_khau = db.relationship("HoKhau", back_populates="lich_su_ho_khau")