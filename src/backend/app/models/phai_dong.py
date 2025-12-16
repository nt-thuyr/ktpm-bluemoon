# Bảng trung gian: Hộ khẩu A phải đóng khoản thu B với số tiền cụ thể

from ..extensions import db

class PhaiDong(db.Model):
    __tablename__ = "phai_dong"

    ho_khau_id = db.Column(
        db.Integer,
        db.ForeignKey("ho_khau.so_ho_khau"),
        primary_key=True
    )
    khoan_thu_id = db.Column(
        db.Integer,
        db.ForeignKey("khoan_thu.id"),
        primary_key=True
    )

    so_tien_phai_dong = db.Column(db.Numeric(12, 2), nullable=False)
    han_nop = db.Column(db.Date)  #Hạn nộp cụ thể (có thể gia hạn)
    trang_thai = db.Column( 
        db.Enum("CHUA_NOP", "DA_NOP_MOT_PHAN", "DA_NOP_DU"),
        default="CHUA_NOP"
    )
