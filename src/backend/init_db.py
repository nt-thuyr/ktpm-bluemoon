from app import create_app, db
from app.models.user import User
from app.models import NhanKhau, HoKhau, LichSuHoKhau, TamTruTamVang, KhoanThu, NopTien

app = create_app()

with app.app_context():
    # db.create_all() sẽ quét tất cả các class db.Model đã được import và tạo bảng tương ứng
    db.create_all()
    print(">>> Đã tạo file database.db và đầy đủ các bảng!")

    # Tạo dữ liệu mẫu
    def _ensure_user(username, vai_tro, ho_ten, password="password"):
        if not User.query.filter_by(username=username).first():
            u = User(username=username, vai_tro=vai_tro, ho_ten=ho_ten)
            u.set_password(password)
            db.session.add(u)
            db.session.commit()
            print(f"    + Đã tạo user: {username}")
        else:
            print(f"    - User {username} đã tồn tại.")


    _ensure_user('admin', 'Tổ trưởng', 'Super Admin', 'password')
    _ensure_user('ketoan_test', 'Kế toán', 'Nhân Viên Kế Toán', 'password')

    print(">>> Hoàn tất thiết lập cơ sở dữ liệu.")