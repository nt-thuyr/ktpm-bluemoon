def test_khoan_thu_crud(client, token_ke_toan):
    headers = {'Authorization': f'Bearer {token_ke_toan}'}

    # === 1. CREATE ===
    # Payload dùng snake_case (để kiểm tra tính năng normalize của Schema)
    payload = {
        'ten_khoan_thu': 'Quỹ Khuyến Học 2025',
        'so_tien': 20000,
        'bat_buoc': False,
        'ghi_chu': 'Tự nguyện'
    }
    r = client.post('/api/khoan-thu/', json=payload, headers=headers)

    # Assert thành công
    assert r.status_code == 201, f"Create failed: {r.get_json()}"

    data = r.get_json()

    # Kiểm tra key trả về phải là PascalCase (do Schema định nghĩa data_key)
    assert 'Id' in data, "API phải trả về key 'Id'"
    assert data['TenKhoanThu'] == 'Quỹ Khuyến Học 2025'

    # Lưu ID để dùng cho bước sau
    kt_id = data['Id']

    # === 2. UPDATE ===
    # Thử update với payload PascalCase (Schema vẫn phải hiểu nhờ normalize)
    update_payload = {
        'TenKhoanThu': 'Quỹ Khuyến Học (Updated)',
        'SoTien': 25000,
        'BatBuoc': False
    }
    r2 = client.put(f'/api/khoan-thu/{kt_id}', json=update_payload, headers=headers)
    assert r2.status_code == 200, f"Update failed: {r2.get_json()}"

    data_update = r2.get_json()
    assert data_update['SoTien'] == 25000.0

    # === 3. DELETE ===
    r3 = client.delete(f'/api/khoan-thu/{kt_id}', headers=headers)
    assert r3.status_code == 200

    # === 4. VERIFY DELETE ===
    r4 = client.get(f'/api/khoan-thu/{kt_id}', headers=headers)
    assert r4.status_code == 404