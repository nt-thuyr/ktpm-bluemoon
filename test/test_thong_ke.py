from datetime import datetime


# --- 1. Test Phân quyền (Access Control) ---

def test_financial_statistics_access(client, token_ke_toan, token_to_truong):
    """
    Kiểm tra endpoint: /api/thong-ke/dashboard/tai-chinh
    - Kế toán: 200 OK
    - Tổ trưởng: 403 Forbidden
    """
    # Case 1: Kế toán truy cập -> Thành công
    headers_ketoan = {'Authorization': f'Bearer {token_ke_toan}'}
    resp = client.get('/api/thong-ke/dashboard/tai-chinh', headers=headers_ketoan)
    assert resp.status_code == 200, f"Kế toán không truy cập được: {resp.get_json()}"

    data = resp.get_json()
    assert 'cards' in data
    assert 'tong_doanh_thu' in data['cards']

    # Case 2: Tổ trưởng truy cập -> Bị chặn
    headers_truong = {'Authorization': f'Bearer {token_to_truong}'}
    resp_fail = client.get('/api/thong-ke/dashboard/tai-chinh', headers=headers_truong)
    assert resp_fail.status_code == 403


def test_population_statistics_access(client, token_to_truong, token_ke_toan):
    """
    Kiểm tra endpoint: /api/thong-ke/dashboard/dan-cu
    - Tổ trưởng: 200 OK
    - Kế toán: 403 Forbidden
    """
    # Case 1: Tổ trưởng truy cập -> Thành công
    headers_truong = {'Authorization': f'Bearer {token_to_truong}'}
    resp = client.get('/api/thong-ke/dashboard/dan-cu', headers=headers_truong)
    assert resp.status_code == 200, f"Tổ trưởng không truy cập được: {resp.get_json()}"

    data = resp.get_json()
    assert 'cards' in data
    assert 'tong_cu_dan' in data['cards']

    # Case 2: Kế toán truy cập -> Bị chặn
    headers_ketoan = {'Authorization': f'Bearer {token_ke_toan}'}
    resp_fail = client.get('/api/thong-ke/dashboard/dan-cu', headers=headers_ketoan)
    assert resp_fail.status_code == 403


# --- 2. Test Tính chính xác dữ liệu (Data Accuracy) ---

def test_statistics_workflow(client, token_ke_toan, token_to_truong):
    """
    Quy trình test tích hợp:
    1. Tạo Nhân khẩu -> Check thống kê Dân cư
    2. Tạo Hộ khẩu -> Tạo Khoản thu -> Nộp tiền -> Check thống kê Tài chính
    """
    headers_truong = {'Authorization': f'Bearer {token_to_truong}'}
    headers_ketoan = {'Authorization': f'Bearer {token_ke_toan}'}

    # === BƯỚC 1: Kiểm tra Thống kê Dân cư ===

    # Lấy số liệu cũ
    r_prev = client.get('/api/thong-ke/dashboard/dan-cu', headers=headers_truong)
    prev_count = r_prev.get_json()['cards']['tong_cu_dan']

    # Tạo Nhân khẩu mới
    nk_payload = {
        'HoTen': 'Nguyen Van Thong Ke',
        'NgaySinh': '1990-01-01',
        'GioiTinh': 'Nam',
        'cccd': '001090000999'
    }
    r_nk = client.post('/api/nhan-khau/', json=nk_payload, headers=headers_truong)
    assert r_nk.status_code == 201
    nk_id = r_nk.get_json()['data']['id']

    # Kiểm tra số liệu mới (phải tăng 1)
    r_curr = client.get('/api/thong-ke/dashboard/dan-cu', headers=headers_truong)
    curr_count = r_curr.get_json()['cards']['tong_cu_dan']
    assert curr_count == prev_count + 1

    # === BƯỚC 2: Kiểm tra Thống kê Tài chính ===

    # Tạo Hộ khẩu
    hk_payload = {
        'ChuHoID': nk_id,
        'SoNha': '999', 'Duong': 'Test Road', 'Phuong': 'P Test', 'Quan': 'Q Test'
    }
    r_hk = client.post('/api/ho-khau/', json=hk_payload, headers=headers_truong)
    assert r_hk.status_code == 201

    # Lấy SoHoKhau (Lưu ý: Service trả về key PascalCase 'SoHoKhau')
    hk_data = r_hk.get_json()
    hk_id = hk_data.get('SoHoKhau')
    assert hk_id is not None

    # Tạo Khoản thu
    kt_payload = {
        'ten_khoan_thu': 'Phí Test Thống Kê',
        'so_tien': 500000,
        'bat_buoc': True
    }
    r_kt = client.post('/api/khoan-thu/', json=kt_payload, headers=headers_ketoan)
    assert r_kt.status_code == 201

    kt_data = r_kt.get_json()
    kt_id = kt_data.get('Id') or kt_data.get('id')
    assert kt_id is not None, f"Không lấy được ID Khoản thu. Resp: {kt_data}"

    # Nộp tiền
    amount_paid = 500000.0
    nop_tien_payload = {
        'ho_khau_id': hk_id,
        'khoan_thu_id': kt_id,
        'so_tien': amount_paid,
        'ngay_nop': datetime.now().strftime('%Y-%m-%d'),
        'nguoi_nop': 'Nguyen Van Thong Ke'
    }
    r_nop = client.post('/api/nop-tien/', json=nop_tien_payload, headers=headers_ketoan)

    # Debug nếu lỗi: print(r_nop.get_json())
    assert r_nop.status_code == 201

    # Kiểm tra Thống kê Tài chính
    r_fin = client.get('/api/thong-ke/dashboard/tai-chinh', headers=headers_ketoan)
    fin_data = r_fin.get_json()

    total_revenue = float(fin_data['cards']['tong_doanh_thu'])
    assert total_revenue >= amount_paid