from datetime import date, timedelta
import random
from app import create_app, db
from app.models.user import User
from app.models.ho_khau import HoKhau
from app.models.nhan_khau import NhanKhau
from app.models.khoan_thu import KhoanThu
from app.models.nop_tien import NopTien
from app.models.lich_su_ho_khau import LichSuHoKhau
from app.models.tam_tru_tam_vang import TamTruTamVang

app = create_app()

def init_db():
    """Khởi tạo cơ sở dữ liệu và tạo user admin nếu chưa có"""
    db.create_all()
    # Kiểm tra xem đã có admin chưa, chưa có thì tạo
    if not User.query.filter_by(username='admin').first():
        u = User(username="admin", vai_tro="Tổ trưởng", ho_ten="Super Admin")
        u.set_password("password")
        db.session.add(u)
        db.session.commit()
        print("Đã tạo user admin/password")
    else:
        print("User admin đã tồn tại.")

def create_users():
    """Tạo tài khoản quản trị"""
    users = [
        {"u": "totruong_test", "r": "Tổ trưởng", "n": "Tên Tổ Trưởng"},
        {"u": "ketoan_test", "r": "Kế toán", "n": "Tên Kế Toán"},
    ]
    count = 0
    for u_data in users:
        if not User.query.filter_by(username=u_data["u"]).first():
            user = User(username=u_data["u"], vai_tro=u_data["r"], ho_ten=u_data["n"])
            user.set_password("password")
            db.session.add(user)
            count += 1
    print(f">>> [OK] Đã kiểm tra/tạo {count} tài khoản Admin mới.")


def create_fees():
    """Tạo 5 loại khoản thu mẫu"""
    fees_data = [
        {"ten": "Phí vệ sinh T12/2025", "tien": 30000.0, "bat_buoc": True, "han": date(2025, 12, 31)},
        {"ten": "Phí dịch vụ T12/2025", "tien": 150000.0, "bat_buoc": True, "han": date(2025, 12, 31)},
        {"ten": "Tiền điện T11/2025", "tien": 0, "bat_buoc": True, "han": date(2025, 12, 15)},
        {"ten": "Quỹ vì người nghèo 2025", "tien": 0, "bat_buoc": False, "han": date(2025, 12, 31)},
        {"ten": "Ủng hộ đồng bào lũ lụt", "tien": 0, "bat_buoc": False, "han": date(2025, 11, 30)}
    ]

    count = 0
    for f in fees_data:
        if not KhoanThu.query.filter_by(ten_khoan_thu=f["ten"]).first():
            kt = KhoanThu(
                ten_khoan_thu=f["ten"],
                so_tien=f["tien"],
                bat_buoc=f["bat_buoc"],
                ghi_chu="Khoản thu khởi tạo tự động",
                ngay_tao=date(2025, 11, 1),
                han_nop=f["han"]
            )
            db.session.add(kt)
            count += 1
    print(f">>> [OK] Đã tạo {count} khoản thu mới.")


def create_population():
    """Tạo 20 Hộ khẩu và ~50 Nhân khẩu"""

    ho_list = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng"]
    dem_list = ["Văn", "Thị", "Đức", "Ngọc", "Minh", "Thanh"]
    ten_list = ["Hùng", "Lan", "Tuấn", "Hoa", "Dũng", "Mai", "Kiên", "Hương"]

    def rand_name(gender="Nam"):
        ho = random.choice(ho_list)
        dem = "Văn" if gender == "Nam" else "Thị"
        ten = random.choice(ten_list)
        return f"{ho} {dem} {ten}"

    if HoKhau.query.count() >= 20:
        print(">>> [SKIP] Dữ liệu dân cư đã đủ (>= 20 hộ).")
        return

    print(">>> [START] Đang sinh dữ liệu 20 hộ khẩu & 50 nhân khẩu...")

    for i in range(1, 21):
        floor = (i // 5) + 1
        room = i % 5
        if room == 0: room = 5
        so_nha = f"P{floor}0{room}"

        # 1. Tạo Chủ hộ
        chu_ho_name = rand_name("Nam")
        cccd_chu_ho = f"0012020{i:05d}"

        # SỬA LỖI TẠI ĐÂY: Đã xóa trường dia_chi_hien_nay
        nk_chu_ho = NhanKhau(
            ho_ten=chu_ho_name,
            ngay_sinh=date(1975 + (i % 10), 1 + (i % 12), 15),
            gioi_tinh="Nam",
            cccd=cccd_chu_ho,
            dan_toc="Kinh",
            ton_giao="Không",
            nghe_nghiep="Tự do",
            ngay_them_nhan_khau=date(2023, 1, 1)
        )
        db.session.add(nk_chu_ho)
        db.session.flush()

        # 2. Tạo Hộ Khẩu
        hk = HoKhau(
            so_ho_khau=100 + i,
            chu_ho_id=nk_chu_ho.id,
            so_nha=so_nha,
            duong="Tòa A - BlueMoon",
            ngay_lam_ho_khau=date(2023, 1, 1),
            quan="Hai Bà Trưng",
            phuong="Bách Khoa"
        )
        db.session.add(hk)
        db.session.flush()

        # Update chủ hộ
        nk_chu_ho.ho_khau_id = hk.so_ho_khau
        nk_chu_ho.quan_he_voi_chu_ho = "Chủ hộ"

        # Ghi lịch sử
        ls = LichSuHoKhau(
            nhan_khau_id=nk_chu_ho.id,
            ho_khau_id=hk.so_ho_khau,
            loai_thay_doi=1,
            thoi_gian=date(2023, 1, 1)
        )
        db.session.add(ls)

        # 3. Tạo thành viên
        num_members = random.randint(1, 3)
        for j in range(num_members):
            if j == 0:
                nk_vo = NhanKhau(
                    ho_ten=rand_name("Nữ"),
                    ngay_sinh=date(1980 + (i % 5), 5, 20),
                    gioi_tinh="Nữ",
                    cccd=f"0012021{i:03d}{j}",
                    dan_toc="Kinh",
                    ton_giao="Không",
                    nghe_nghiep="Đầu bếp",
                    ho_khau_id=hk.so_ho_khau,
                    quan_he_voi_chu_ho="Vợ",
                    ngay_them_nhan_khau=date(2023, 2, 1)
                )
                db.session.add(nk_vo)
            else:  # Con
                nk_con = NhanKhau(
                    ho_ten=rand_name("Nam" if j % 2 == 0 else "Nữ"),
                    ngay_sinh=date(2010 + j, 8, 15),
                    gioi_tinh="Nam" if j % 2 == 0 else "Nữ",
                    dan_toc="Kinh",
                    ton_giao="Không",
                    nghe_nghiep="Học sinh",
                    ho_khau_id=hk.so_ho_khau,
                    quan_he_voi_chu_ho="Con",
                    ngay_them_nhan_khau=date(2023, 2, 1)
                )
                db.session.add(nk_con)

    print(">>> [OK] Đã tạo xong dữ liệu dân cư.")


def create_history_records():
    """Tạo lịch sử mẫu"""
    hk = HoKhau.query.first()
    if hk:
        member = NhanKhau.query.filter_by(ho_khau_id=hk.so_ho_khau, quan_he_voi_chu_ho="Con").first()
        if member:
            existing_ls = LichSuHoKhau.query.filter_by(nhan_khau_id=member.id, loai_thay_doi=2).first()
            if not existing_ls:
                ls_ra = LichSuHoKhau(
                    nhan_khau_id=member.id,
                    ho_khau_id=hk.so_ho_khau,
                    loai_thay_doi=2,  # Chuyển đi
                    thoi_gian=date.today() - timedelta(days=5)
                )
                db.session.add(ls_ra)
                print(">>> [OK] Đã tạo mẫu lịch sử chuyển đi.")


if __name__ == "__main__":
    with app.app_context():
        print("--- START SEEDING ---")
        db.create_all()

        create_users()
        create_fees()
        create_population()
        create_history_records()

        try:
            db.session.commit()
            print("--- SEEDING COMPLETED SUCCESSFULLY ---")
        except Exception as e:
            db.session.rollback()
            print(f"--- ERROR: {e} ---")