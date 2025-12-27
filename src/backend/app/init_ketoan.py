from . import create_app
from .extensions import db
from .models.user import User

app = create_app()

with app.app_context():
    # Đảm bảo bảng đã tồn tại (nếu chạy file này độc lập)
    db.create_all()
    print("Đảm bảo các bảng dữ liệu đã sẵn sàng.")

    if not User.query.filter_by(username='ketoan_test').first():
        u = User(username="ketoan_test", vai_tro="Kế toán", ho_ten="Nhân Viên Kế Toán")
        u.set_password("password") # Mật khẩu mặc định là 'password'
        
        db.session.add(u)
        db.session.commit()
        print(">>> Đã tạo thành công user: ketoan_test / password")
    else:
        print(">>> User ketoan_test đã tồn tại, không cần tạo thêm.")