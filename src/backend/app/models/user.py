from ..extensions import db

class User(db.Model):
    __tablename__ = "users"

    username = db.Column(db.String(50), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    vai_tro = db.Column(db.String(20))