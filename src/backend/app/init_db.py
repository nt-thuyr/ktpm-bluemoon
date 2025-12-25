from . import create_app
from extensions import db
from models.user import User

app = create_app()

with app.app_context():
    # 1. Tạo bảng
    db.create_all()
    print("Đã tạo bảng thành công!")

    # 2. Kiểm tra xem đã có admin chưa, chưa có thì tạo
    if not User.query.filter_by(username='admin').first():
        u = User(username="admin", vai_tro="Tổ trưởng", ho_ten="Super Admin")
        u.set_password("password")
        db.session.add(u)
        db.session.commit()
        print("Đã tạo user admin/password")
    else:
        print("User admin đã tồn tại.")