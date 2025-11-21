from app.extensions import db

class Users(db.Model):
    __tablename__ = "users"

    UserName = db.Column(db.String(50), primary_key=True)
    PassWord = db.Column(db.String(255), nullable=False)
    vaiTro = db.Column(db.String(20))
