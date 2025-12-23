def test_khoan_thu_crud(client, token_ke_toan):
    headers = {'Authorization': f'Bearer {token_ke_toan}'}

    # 1. Create
    payload = {
        'ten_khoan_thu': 'Quỹ Khuyến Học 2025',
        'so_tien': 20000,
        'bat_buoc': False,
        'ghi_chu': 'Tự nguyện'
    }
    r = client.post('/api/khoan-thu/', json=payload, headers=headers)
    assert r.status_code == 201

    data = r.get_json()
    # Support both dict response or list response
    if isinstance(data, list):
        kt = data[0] if data else {}
    else:
        kt = data.get('data', data)

    # Check kết quả trả về (hỗ trợ cả 2 trường hợp key trả về)
    res_ten = kt.get('TenKhoanThu') or kt.get('ten_khoan_thu')
    assert res_ten == 'Quỹ Khuyến Học 2025'

    kt_id = kt.get('id') or kt.get('Id')

    # 2. Get list
    r2 = client.get('/api/khoan-thu/', headers=headers)
    assert r2.status_code == 200
    j2 = r2.get_json()
    # Normalize list payload
    if isinstance(j2, dict):
        list_data = j2.get('data', j2.get('items', []))
    else:
        list_data = j2

    # Tìm xem id vừa tạo có trong list không
    found = False
    for item in list_data:
        item_id = item.get('id') or item.get('Id')
        if item_id == kt_id:
            found = True
            break
    assert found is True

    # 3. Update (Dùng snake_case)
    update_payload = {
        'ten_khoan_thu': 'Quỹ Khuyến Học (Updated)',
        'so_tien': 25000,
        'bat_buoc': False
    }
    r4 = client.put(f'/api/khoan-thu/{kt_id}', json=update_payload, headers=headers)
    assert r4.status_code == 200

    # 4. Delete
    r5 = client.delete(f'/api/khoan-thu/{kt_id}', headers=headers)
    assert r5.status_code in [200, 204]

    # 5. Ensure deleted
    r6 = client.get(f'/api/khoan-thu/{kt_id}', headers=headers)
    assert r6.status_code == 404