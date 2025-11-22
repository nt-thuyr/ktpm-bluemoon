import requests
import json

# Cấu hình URL (Đảm bảo server Flask đang chạy)
BASE_URL = "http://127.0.0.1:5000/nhan-khau"


def print_result(step_name, response):
    print(f"\n=== {step_name} ===")
    print(f"Status Code: {response.status_code}")
    try:
        # ensure_ascii=False để in tiếng Việt không bị lỗi font
        print("Response:", json.dumps(response.json(), indent=2, ensure_ascii=False))
    except:
        print("Response Text:", response.text)


def run_tests():
    # ---------------------------------------------------------
    # 1. TẠO MỚI (POST)
    # ---------------------------------------------------------
    print("--> Dang tao nhan khau moi...")
    payload = {
        "ho_ten": "Nguyen Van Test",  # Sửa thành snake_case
        "ngay_sinh": "1999-09-09",
        "gioi_tinh": "Nam",
        "dan_toc": "Kinh",
        "ton_giao": "Khong",
        "cccd": "012345678999",
        "ngay_cap": "2021-01-01",
        "noi_cap": "Ha Noi",
        "nghe_nghiep": "Lap Trinh Vien",
        "ghi_chu": "Test bang Python Script"
    }

    # Gửi request
    res = requests.post(f"{BASE_URL}/", json=payload)
    print_result("1. POST - Tao Moi", res)

    if res.status_code not in [200, 201]:
        print("Lỗi tạo mới, dừng test.")
        return

    # Lấy ID vừa tạo để dùng cho các bước sau
    data = res.json()
    new_id = data.get("id")
    # Lưu ý: data trả về bây giờ cũng là snake_case (data['ho_ten'])

    # ---------------------------------------------------------
    # 2. LẤY DANH SÁCH (GET ALL)
    # ---------------------------------------------------------
    res = requests.get(f"{BASE_URL}/")
    print_result("2. GET ALL - Lay Danh Sach", res)

    # ---------------------------------------------------------
    # 3. LẤY CHI TIẾT (GET BY ID)
    # ---------------------------------------------------------
    if new_id:
        res = requests.get(f"{BASE_URL}/{new_id}")
        print_result(f"3. GET BY ID - Lay ID {new_id}", res)

    # ---------------------------------------------------------
    # 4. CẬP NHẬT (PUT)
    # ---------------------------------------------------------
    if new_id:
        update_data = {
            "ho_ten": "Nguyen Van Test (Da Sua)",  # snake_case
            "nghe_nghiep": "Senior Developer",
            "ghi_chu": "Da duoc thang chuc"
        }
        res = requests.put(f"{BASE_URL}/{new_id}", json=update_data)
        print_result(f"4. PUT - Cap Nhat ID {new_id}", res)

    # ---------------------------------------------------------
    # 5. XÓA (DELETE)
    # ---------------------------------------------------------
    if new_id:
        res = requests.delete(f"{BASE_URL}/{new_id}")
        print_result(f"5. DELETE - Xoa ID {new_id}", res)

    # ---------------------------------------------------------
    # 6. KIỂM TRA LẠI SAU KHI XÓA
    # ---------------------------------------------------------
    if new_id:
        res = requests.get(f"{BASE_URL}/{new_id}")
        print(f"\n=== 6. Kiem tra lai ID {new_id} ===")
        if res.status_code == 404:
            print("SUCCESS: Da xoa thanh cong (Khong tim thay ID).")
        else:
            print("FAIL: Van tim thay ID.")


if __name__ == "__main__":
    try:
        # Ping thử server
        requests.get("http://127.0.0.1:5000/")
        run_tests()
    except requests.exceptions.ConnectionError:
        print("❌ LỖI: Không thể kết nối tới Server.")
        print("Hãy chắc chắn bạn đã chạy lệnh 'flask run' ở terminal khác.")