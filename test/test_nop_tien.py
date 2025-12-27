import os
from datetime import datetime

def test_nop_tien_crud(client, token_to_truong, token_ke_toan):
    headers_truong = {'Authorization': f'Bearer {token_to_truong}'}
    headers_ketoan = {'Authorization': f'Bearer {token_ke_toan}'}

    # === 1. SETUP DÂN CƯ===
    nk_payload = {'HoTen': 'Chu Ho Dong Tien', 'NgaySinh': '1980-01-01', 'GioiTinh': 'Nam'}
    r_nk = client.post('/api/nhan-khau/', json=nk_payload, headers=headers_truong)
    assert r_nk.status_code == 201

    nk_json = r_nk.get_json()
    nk_data = nk_json.get('data', nk_json)
    chu_ho_id = nk_data.get('ID') or nk_data.get('id') or nk_data.get('Id')

    hk_payload = {
        'ChuHoID': chu_ho_id,
        'SoNha': '123', 'Duong': 'Pho Hue',
        'Phuong': 'Phuong Z', 'Quan': 'Quan T'
    }
    r_hk = client.post('/api/ho-khau/', json=hk_payload, headers=headers_truong)
    assert r_hk.status_code == 201

    hk_json = r_hk.get_json()
    hk_data = hk_json.get('data', hk_json)
    so_ho_khau = hk_data.get('SoHoKhau') or hk_data.get('id') or hk_data.get('Id')

    # === 2. SETUP KHOẢN THU (Chuyển sang snake_case) ===
    kt_payload = {
        'ten_khoan_thu': 'Phí An Ninh',
        'so_tien': 15000,
        'bat_buoc': True
    }
    r_kt = client.post('/api/khoan-thu/', json=kt_payload, headers=headers_ketoan)
    assert r_kt.status_code == 201

    kt_json = r_kt.get_json()
    kt_data = kt_json.get('data', kt_json)
    khoan_thu_id = kt_data.get('Id') or kt_data.get('id')

    # === 3. TEST NỘP TIỀN (Chuyển sang snake_case) ===
    nop_tien_payload = {
        'ho_khau_id': so_ho_khau,
        'khoan_thu_id': khoan_thu_id,
        'so_tien': 15000,
        'ngay_nop': datetime.now().strftime('%Y-%m-%d'),
        'nguoi_nop': 'Chu Ho Dong Tien'
    }

    r = client.post('/api/nop-tien/', json=nop_tien_payload, headers=headers_ketoan)
    assert r.status_code == 201

    nt_json = r.get_json()
    nt_data = nt_json.get('data', nt_json)
    nt_id = nt_data.get('Id') or nt_data.get('id')

    # === 4. DELETE (Dọn dẹp) ===
    if nt_id:
        r_del = client.delete(f'/api/nop-tien/{nt_id}', headers=headers_ketoan)
        assert r_del.status_code in [200, 204]

    # Ensure deleted
    r_check = client.get(f'/api/nop-tien/{nt_id}', headers=headers_ketoan)
    assert r_check.status_code == 404


def test_export_pdf_receipt_file(client, token_to_truong, token_ke_toan):
    """
    Test case này sẽ tạo dữ liệu mẫu và XUẤT RA FILE PDF thực tế
    để bạn có thể mở lên xem.
    File sẽ được lưu là 'bien_lai_mau.pdf' trong thư mục chạy test.
    """
    headers_truong = {'Authorization': f'Bearer {token_to_truong}'}
    headers_ketoan = {'Authorization': f'Bearer {token_ke_toan}'}

    nk_payload = {'HoTen': 'Nguyen Van A', 'NgaySinh': '1990-01-01', 'GioiTinh': 'Nam', 'CCCD': '00123456789'}
    r_nk = client.post('/api/nhan-khau/', json=nk_payload, headers=headers_truong)
    assert r_nk.status_code == 201, f"Tạo nhân khẩu lỗi: {r_nk.json}"

    nk_data = r_nk.get_json()['data']
    chu_ho_id = nk_data.get('id') or nk_data.get('Id') or nk_data.get('ID')

    hk_payload = {'ChuHoID': chu_ho_id, 'SoNha': 'P101', 'Duong': 'BlueMoon St', 'Phuong': 'Yen Phu', 'Quan': 'Tay Ho'}
    r_hk = client.post('/api/ho-khau/', json=hk_payload, headers=headers_truong)
    assert r_hk.status_code == 201, f"Tạo hộ khẩu lỗi: {r_hk.json}"

    hk_data = r_hk.get_json()
    so_ho_khau = hk_data.get('SoHoKhau') or hk_data.get('id') or hk_data.get('Id')

    kt_payload = {'ten_khoan_thu': 'Phí Vệ Sinh Tháng 12', 'so_tien': 50000, 'bat_buoc': True}
    r_kt = client.post('/api/khoan-thu/', json=kt_payload, headers=headers_ketoan)
    assert r_kt.status_code == 201, f"Tạo khoản thu lỗi: {r_kt.json}"

    kt_data = r_kt.get_json()
    khoan_thu_id = kt_data.get('id') or kt_data.get('Id')

    nop_tien_payload = {
        'ho_khau_id': so_ho_khau,
        'khoan_thu_id': khoan_thu_id,
        'so_tien': 50000,
        'ngay_nop': datetime.now().strftime('%Y-%m-%d'),
        'nguoi_nop': 'Nguyen Van A'
    }
    r_nop = client.post('/api/nop-tien/', json=nop_tien_payload, headers=headers_ketoan)
    assert r_nop.status_code == 201, f"Nộp tiền lỗi: {r_nop.json}"

    nt_data = r_nop.get_json()
    nop_tien_id = nt_data.get('id') or nt_data.get('Id')

    r_pdf = client.get(f'/api/nop-tien/{nop_tien_id}/pdf', headers=headers_ketoan)

    assert r_pdf.status_code == 200
    assert r_pdf.mimetype == 'application/pdf'

    output_filename = "bien_lai_mau.pdf"
    with open(output_filename, "wb") as f:
        f.write(r_pdf.data)

    print(f"\n[THANH CONG] File PDF da duoc luu tai: {os.path.abspath(output_filename)}")