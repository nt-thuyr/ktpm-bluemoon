from datetime import date, timedelta
import random
from app import create_app, db
from app.models. user import User
from app.models.ho_khau import HoKhau
from app.models.nhan_khau import NhanKhau
from app.models. khoan_thu import KhoanThu
from app.models.nop_tien import NopTien
from app.models. lich_su_ho_khau import LichSuHoKhau
from app.models. tam_tru_tam_vang import TamTruTamVang

app = create_app()


def init_db():
    """Khởi tạo cơ sở dữ liệu"""
    db.create_all()
    print("Đã khởi tạo cơ sở dữ liệu.")


def create_users():
    """Tạo tài khoản Tổ trưởng duy nhất"""
    if not User.query.filter_by(username='totruong').first():
        user = User(username="totruong", vai_tro="Tổ trưởng", ho_ten="Nguyễn Tổ Trưởng")
        user.set_password("password")
        db.session. add(user)
        print(">>> [OK] Đã tạo tài khoản Tổ trưởng (totruong/password)")
    else:
        print(">>> [SKIP] Tài khoản Tổ trưởng đã tồn tại.")


def create_fees():
    """Tạo 10 loại khoản thu đa dạng cho 6 tháng gần đây"""
    # Lấy ngày hiện tại
    today = date.today()

    fees_data = []

    # Tạo các khoản thu định kỳ hàng tháng (6 tháng gần đây)
    for i in range(6):
        month_offset = 5 - i  # Từ 5 tháng trước đến tháng hiện tại
        target_date = date(today.year, today.month, 1) - timedelta(days=month_offset * 30)
        month = target_date.month
        year = target_date.year

        # Phí vệ sinh
        fees_data.append({
            "ten":  f"Phí vệ sinh T{month:02d}/{year}",
            "tien":  random.choice([25000, 30000, 35000]),
            "bat_buoc": True,
            "han":  date(year, month, 25),
            "ngay_tao": date(year, month, 1)
        })

        # Phí dịch vụ
        fees_data.append({
            "ten": f"Phí dịch vụ chung cư T{month:02d}/{year}",
            "tien": random.choice([120000, 150000, 180000]),
            "bat_buoc": True,
            "han": date(year, month, 28),
            "ngay_tao": date(year, month, 1)
        })

        # Tiền điện (biến động)
        fees_data.append({
            "ten":  f"Tiền điện T{month:02d}/{year}",
            "tien": 0,  # Tính theo số điện thực tế
            "bat_buoc": True,
            "han": date(year, month, 20),
            "ngay_tao": date(year, month, 1)
        })

        # Tiền nước
        fees_data.append({
            "ten": f"Tiền nước T{month:02d}/{year}",
            "tien": 0,  # Tính theo số nước thực tế
            "bat_buoc": True,
            "han": date(year, month, 20),
            "ngay_tao": date(year, month, 1)
        })

    # Các khoản đóng góp tự nguyện
    fees_data.extend([
        {
            "ten": "Quỹ vì người nghèo 2025",
            "tien": 0,
            "bat_buoc": False,
            "han": date(today.year, 12, 31),
            "ngay_tao": date(today.year, 1, 15)
        },
        {
            "ten": "Ủng hộ đồng bào lũ lụt miền Trung",
            "tien": 0,
            "bat_buoc": False,
            "han": date(today.year, 11, 30),
            "ngay_tao": date(today.year, 10, 1)
        },
        {
            "ten": "Quỹ khuyến học sinh viên vượt khó",
            "tien": 0,
            "bat_buoc": False,
            "han": date(today.year, 12, 15),
            "ngay_tao": date(today.year, 11, 1)
        },
        {
            "ten": "Phí bảo trì thang máy 2025",
            "tien":  50000,
            "bat_buoc": True,
            "han": date(today.year, 6, 30),
            "ngay_tao": date(today.year, 1, 1)
        },
        {
            "ten": "Phí gửi xe ô tô tháng",
            "tien": 1200000,
            "bat_buoc": False,
            "han": date(today.year, today.month, 5),
            "ngay_tao": date(today.year, today.month, 1)
        },
        {
            "ten": "Phí gửi xe máy tháng",
            "tien": 100000,
            "bat_buoc": False,
            "han": date(today.year, today.month, 5),
            "ngay_tao": date(today.year, today.month, 1)
        }
    ])

    count = 0
    for f in fees_data:
        if not KhoanThu.query.filter_by(ten_khoan_thu=f["ten"]).first():
            kt = KhoanThu(
                ten_khoan_thu=f["ten"],
                so_tien=f["tien"],
                bat_buoc=f["bat_buoc"],
                ghi_chu="Khoản thu tự động",
                ngay_tao=f["ngay_tao"],
                han_nop=f["han"]
            )
            db.session.add(kt)
            count += 1

    db.session.flush()
    print(f">>> [OK] Đã tạo {count} khoản thu mới.")


def create_population():
    """Tạo 50 Hộ khẩu và ~150 Nhân khẩu với dữ liệu đa dạng"""

    ho_list = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
    ten_dem_list = ["Văn", "Thị", "Minh", "Hồng", "Thu", "Anh", "Đức", "Ngọc", "Quang", "Thùy", "Hải", "Mai"]
    ten_list = ["An", "Bình", "Cường", "Dũng", "Em", "Giang", "Hà", "Hiếu", "Khoa", "Linh",
                "Minh", "Nam", "Phương", "Quân", "Sơn", "Trang", "Tuấn", "Uyên", "Vân", "Xuân"]

    dan_toc_list = ["Kinh", "Tày", "Thái", "Mường", "Khmer", "Hoa", "Nùng", "H'Mông"]
    ton_giao_list = ["Không", "Phật giáo", "Công giáo", "Tin lành", "Cao đài", "Hòa Hảo"]
    nghe_nghiep_list = ["Công nhân", "Nhân viên văn phòng", "Giáo viên", "Bác sĩ", "Kỹ sư",
                        "Kinh doanh", "Nội trợ", "Học sinh", "Sinh viên", "Hưu trí", "Tự do"]

    def rand_name():
        ho = random.choice(ho_list)
        ten_dem = random.choice(ten_dem_list)
        ten = random.choice(ten_list)
        return f"{ho} {ten_dem} {ten}"

    if HoKhau.query.count() >= 50:
        print(">>> [SKIP] Dữ liệu dân cư đã đủ (>= 50 hộ).")
        return

    print(">>> [START] Đang sinh dữ liệu 50 hộ khẩu & ~150 nhân khẩu...")

    for i in range(1, 51):
        # Tạo số phòng từ P001 đến P050 (có thể mở rộng đến P999)
        so_nha = f"P{i:03d}"

        # 1.  Tạo Chủ hộ
        chu_ho_name = rand_name()
        cccd_chu_ho = f"001{random.randint(1980, 2000)}{i:06d}"
        chu_ho_birth_year = random.randint(1960, 1985)

        nk_chu_ho = NhanKhau(
            ho_ten=chu_ho_name,
            ngay_sinh=date(chu_ho_birth_year, random.randint(1, 12), random.randint(1, 28)),
            gioi_tinh=random.choice(["Nam", "Nữ"]),
            cccd=cccd_chu_ho,
            dan_toc=random.choice(dan_toc_list),
            ton_giao=random.choice(ton_giao_list),
            nghe_nghiep=random.choice(["Kỹ sư", "Giáo viên", "Bác sĩ", "Nhân viên văn phòng", "Kinh doanh"]),
            ngay_them_nhan_khau=date(2023, random.randint(1, 12), random.randint(1, 28))
        )
        db.session.add(nk_chu_ho)
        db.session.flush()

        # 2. Tạo Hộ Khẩu - Địa chỉ chung, chỉ khác số phòng
        hk = HoKhau(
            so_ho_khau=1000 + i,
            chu_ho_id=nk_chu_ho. id,
            so_nha=so_nha,
            duong="59 Trần Đại Nghĩa",
            ngay_lam_ho_khau=date(2023, random.randint(1, 12), random.randint(1, 28)),
            quan="Hai Bà Trưng",
            phuong="Bách Khoa"
        )
        db.session.add(hk)
        db.session.flush()

        # Update chủ hộ
        nk_chu_ho.ho_khau_id = hk. so_ho_khau
        nk_chu_ho.quan_he_voi_chu_ho = "Chủ hộ"

        # Ghi lịch sử
        ls = LichSuHoKhau(
            nhan_khau_id=nk_chu_ho.id,
            ho_khau_id=hk.so_ho_khau,
            loai_thay_doi=1,  # Chuyển đến
            thoi_gian=hk.ngay_lam_ho_khau
        )
        db.session. add(ls)

        # 3. Tạo thành viên gia đình (2-4 người)
        num_members = random.randint(2, 4)

        for j in range(num_members):
            if j == 0:  # Vợ/Chồng
                nk_vo_chong = NhanKhau(
                    ho_ten=rand_name(),
                    ngay_sinh=date(chu_ho_birth_year + random.randint(-3, 3), random.randint(1, 12),
                                   random.randint(1, 28)),
                    gioi_tinh="Nữ" if nk_chu_ho.gioi_tinh == "Nam" else "Nam",
                    cccd=f"001{random.randint(1980, 2000)}{i:04d}{j:02d}",
                    dan_toc=random. choice(dan_toc_list),
                    ton_giao=random.choice(ton_giao_list),
                    nghe_nghiep=random. choice(nghe_nghiep_list),
                    ho_khau_id=hk.so_ho_khau,
                    quan_he_voi_chu_ho="Vợ/Chồng",
                    ngay_them_nhan_khau=hk.ngay_lam_ho_khau
                )
                db.session.add(nk_vo_chong)
                db.session.flush()

                # Lịch sử cho vợ/chồng
                ls_vc = LichSuHoKhau(
                    nhan_khau_id=nk_vo_chong.id,
                    ho_khau_id=hk.so_ho_khau,
                    loai_thay_doi=1,
                    thoi_gian=hk.ngay_lam_ho_khau
                )
                db.session. add(ls_vc)

            else:  # Con cái
                con_birth_year = chu_ho_birth_year + random.randint(20, 35)
                if con_birth_year > 2025:
                    con_birth_year = random.randint(2005, 2020)

                age = 2025 - con_birth_year
                if age < 6:
                    nghe = "Mầm non"
                elif age < 12:
                    nghe = "Học sinh tiểu học"
                elif age < 18:
                    nghe = "Học sinh THCS/THPT"
                elif age < 23:
                    nghe = "Sinh viên"
                else:
                    nghe = random.choice(nghe_nghiep_list)

                cccd_con = None if age < 14 else f"001{con_birth_year}{i:04d}{j:02d}"

                nk_con = NhanKhau(
                    ho_ten=rand_name(),
                    ngay_sinh=date(con_birth_year, random.randint(1, 12), random.randint(1, 28)),
                    gioi_tinh=random.choice(["Nam", "Nữ"]),
                    cccd=cccd_con,
                    dan_toc=nk_chu_ho.dan_toc,  # Con thường theo dân tộc bố/mẹ
                    ton_giao=random.choice(ton_giao_list),
                    nghe_nghiep=nghe,
                    ho_khau_id=hk.so_ho_khau,
                    quan_he_voi_chu_ho="Con",
                    ngay_them_nhan_khau=hk.ngay_lam_ho_khau
                )
                db.session.add(nk_con)
                db.session.flush()

                # Lịch sử cho con
                ls_con = LichSuHoKhau(
                    nhan_khau_id=nk_con.id,
                    ho_khau_id=hk.so_ho_khau,
                    loai_thay_doi=1,
                    thoi_gian=hk.ngay_lam_ho_khau
                )
                db.session.add(ls_con)

    db.session.flush()
    print(">>> [OK] Đã tạo xong dữ liệu dân cư.")


def create_payment_history():
    """Tạo dữ liệu nộp tiền cho 6 tháng gần đây"""
    print(">>> [START] Đang tạo lịch sử nộp tiền...")

    ho_khau_list = HoKhau.query.all()
    khoan_thu_list = KhoanThu.query.all()

    if not ho_khau_list or not khoan_thu_list:
        print(">>> [SKIP] Không có hộ khẩu hoặc khoản thu để tạo dữ liệu nộp tiền.")
        return

    count = 0
    today = date.today()

    for hk in ho_khau_list:
        for kt in khoan_thu_list:
            # 70% hộ nộp đúng hạn, 20% nộp trễ, 10% chưa nộp
            chance = random.random()

            if chance > 0.9:  # 10% chưa nộp
                continue

            # Tính số tiền nộp
            if kt.so_tien == 0:  # Khoản thu biến động
                if "điện" in kt.ten_khoan_thu. lower():
                    so_tien = random.randint(300, 800) * 1000  # 300k - 800k
                elif "nước" in kt.ten_khoan_thu.lower():
                    so_tien = random.randint(80, 200) * 1000  # 80k - 200k
                else:  # Đóng góp tự nguyện
                    so_tien = random.choice([0, 50000, 100000, 200000, 500000])
                    if so_tien == 0:  # Không đóng góp
                        continue
            else:
                so_tien = kt. so_tien

            # Xác định ngày nộp
            if chance <= 0.7:  # 70% nộp đúng hạn
                if kt.han_nop > today:
                    ngay_nop = today - timedelta(days=random.randint(0, 5))
                else:
                    # Nộp trước hạn 1-10 ngày
                    ngay_nop = kt.han_nop - timedelta(days=random.randint(1, 10))
            else:  # 20% nộp trễ
                if kt.han_nop > today:
                    continue  # Chưa đến hạn nên không có nộp trễ
                else:
                    # Nộp sau hạn 1-15 ngày
                    ngay_nop = kt.han_nop + timedelta(days=random.randint(1, 15))
                    if ngay_nop > today:
                        ngay_nop = today

            # Lấy tên người nộp (chủ hộ hoặc thành viên)
            chu_ho = NhanKhau.query.get(hk.chu_ho_id)
            nguoi_nop = chu_ho.ho_ten if chu_ho else "Không xác định"

            # Tạo bản ghi nộp tiền
            nop_tien = NopTien(
                ho_khau_id=hk.so_ho_khau,
                khoan_thu_id=kt. id,
                so_tien=so_tien,
                ngay_nop=ngay_nop,
                nguoi_nop=nguoi_nop
            )
            db.session. add(nop_tien)
            count += 1

    db.session.flush()
    print(f">>> [OK] Đã tạo {count} bản ghi nộp tiền.")


def create_tam_tru_tam_vang():
    """Tạo dữ liệu tạm trú và tạm vắng"""
    print(">>> [START] Đang tạo dữ liệu tạm trú/tạm vắng...")

    nhan_khau_list = NhanKhau.query.all()

    if not nhan_khau_list:
        print(">>> [SKIP] Không có nhân khẩu để tạo dữ liệu tạm trú/tạm vắng.")
        return

    count = 0
    today = date.today()

    # Chọn ngẫu nhiên 20-30% nhân khẩu có tạm trú/tạm vắng
    selected_nhan_khau = random.sample(nhan_khau_list, k=int(len(nhan_khau_list) * random.uniform(0.2, 0.3)))

    dia_chi_list = [
        "Số 123, đường Láng, Đống Đa, Hà Nội",
        "Số 456, đường Nguyễn Trãi, Thanh Xuân, Hà Nội",
        "Số 789, đường Giải Phóng, Hoàng Mai, Hà Nội",
        "Xã Đông Anh, huyện Đông Anh, Hà Nội",
        "Thành phố Hồ Chí Minh",
        "Thành phố Đà Nẵng",
        "Tỉnh Nghệ An",
        "Tỉnh Thanh Hóa",
        "Thành phố Hải Phòng",
        "Tỉnh Quảng Ninh"
    ]

    noi_dung_tam_tru = [
        "Đăng ký tạm trú để làm việc tại Hà Nội",
        "Tạm trú theo học tại các trường đại học",
        "Tạm trú để chăm sóc người thân",
        "Tạm trú để điều trị bệnh",
        "Tạm trú theo hợp đồng thuê nhà"
    ]

    noi_dung_tam_vang = [
        "Tạm vắng về quê nghỉ Tết",
        "Tạm vắng đi công tác dài ngày",
        "Tạm vắng đi du học",
        "Tạm vắng để chữa bệnh tại nơi khác",
        "Tạm vắng để thăm người thân"
    ]

    for nk in selected_nhan_khau:
        # 60% tạm vắng, 40% tạm trú
        is_tam_vang = random. random() < 0.6

        if is_tam_vang:
            trang_thai = "Tạm vắng"
            dia_chi = random.choice(dia_chi_list)
            noi_dung = random.choice(noi_dung_tam_vang)
            # Thời gian tạm vắng trong 6 tháng gần đây
            thoi_gian = today - timedelta(days=random. randint(0, 180))
        else:
            trang_thai = "Tạm trú"
            dia_chi = random.choice(dia_chi_list)
            noi_dung = random.choice(noi_dung_tam_tru)
            # Thời gian tạm trú trong 1 năm gần đây
            thoi_gian = today - timedelta(days=random.randint(0, 365))

        ttv = TamTruTamVang(
            nhan_khau_id=nk.id,
            trang_thai=trang_thai,
            dia_chi=dia_chi,
            thoi_gian=thoi_gian,
            noi_dung_de_nghi=noi_dung
        )
        db.session.add(ttv)
        count += 1

    db.session. flush()
    print(f">>> [OK] Đã tạo {count} bản ghi tạm trú/tạm vắng.")


def create_history_records():
    """Tạo lịch sử chuyển đi/chuyển đến bổ sung"""
    print(">>> [START] Đang tạo lịch sử chuyển đi/chuyển đến...")

    ho_khau_list = HoKhau.query.all()
    count = 0
    today = date.today()

    # Chọn ngẫu nhiên 5-10 hộ có người chuyển đi
    if len(ho_khau_list) < 10:
        selected_ho_khau = random.sample(ho_khau_list, k=min(5, len(ho_khau_list)))
    else:
        selected_ho_khau = random.sample(ho_khau_list, k=random.randint(5, 10))

    for hk in selected_ho_khau:
        # Lấy thành viên không phải chủ hộ
        thanh_vien_list = NhanKhau.query.filter(
            NhanKhau. ho_khau_id == hk.so_ho_khau,
            NhanKhau. quan_he_voi_chu_ho. in_(["Vợ/Chồng", "Con"])
        ).all()

        if thanh_vien_list:
            member = random.choice(thanh_vien_list)

            # Kiểm tra xem đã có lịch sử chuyển đi chưa
            existing_ls = LichSuHoKhau.query.filter_by(
                nhan_khau_id=member.id,
                loai_thay_doi=2
            ).first()

            if not existing_ls:
                thoi_gian_chuyen = today - timedelta(days=random.randint(30, 180))

                ls_ra = LichSuHoKhau(
                    nhan_khau_id=member. id,
                    ho_khau_id=hk.so_ho_khau,
                    loai_thay_doi=2,  # Chuyển đi
                    thoi_gian=thoi_gian_chuyen
                )
                db.session. add(ls_ra)
                count += 1

    db. session.flush()
    print(f">>> [OK] Đã tạo {count} bản ghi lịch sử chuyển đi.")


if __name__ == "__main__":
    with app.app_context():
        print("=" * 60)
        print("    BẮT ĐẦU SEEDING DỮ LIỆU QUẢN LÝ DÂN CƯ")
        print("=" * 60)

        init_db()
        create_users()
        create_fees()
        create_population()
        create_payment_history()
        create_tam_tru_tam_vang()
        create_history_records()

        try:
            db.session.commit()
            print("=" * 60)
            print("    HOÀN TẤT SEEDING DỮ LIỆU THÀNH CÔNG")
            print("=" * 60)
            print("\n📊 Tóm tắt:")
            print(f"   - Tài khoản:  {User.query.count()}")
            print(f"   - Khoản thu: {KhoanThu.query.count()}")
            print(f"   - Hộ khẩu: {HoKhau. query.count()}")
            print(f"   - Nhân khẩu: {NhanKhau.query.count()}")
            print(f"   - Nộp tiền: {NopTien.query.count()}")
            print(f"   - Tạm trú/vắng: {TamTruTamVang.query.count()}")
            print(f"   - Lịch sử:  {LichSuHoKhau.query.count()}")
            print("\n🔑 Tài khoản đăng nhập:")
            print("   Username: totruong")
            print("   Password: password")
            print("\n📍 Địa chỉ chung:  59 Trần Đại Nghĩa, Bách Khoa, Hai Bà Trưng")
            print("   Số phòng: P001 - P050")
            print("=" * 60)
        except Exception as e:
            db.session.rollback()
            print("=" * 60)
            print(f"    ❌ LỖI:  {e}")
            print("=" * 60)