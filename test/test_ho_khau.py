def test_ho_khau_crud(client, token_to_truong):
    headers = {'Authorization': f'Bearer {token_to_truong}'}

    # Create a resident to be ChuHo
    nk_payload = {'HoTen': 'Chu Ho Test', 'NgaySinh': '1980-05-05'}
    r = client.post('/api/nhan-khau/', json=nk_payload, headers=headers)
    assert r.status_code == 201
    nk = r.get_json()['data']
    chu_ho_id = nk['id']

    # Create household
    hk_payload = {
        'ChuHoID': chu_ho_id,
        'SoNha': '12',
        'Duong': 'Pham Van Dong',
        'Phuong': 'Phuong A',
        'Quan': 'Quan B',
        'DienTich': 75.5
    }
    r2 = client.post('/api/ho-khau/', json=hk_payload, headers=headers)
    assert r2.status_code == 201
    hk = r2.get_json()
    so_ho_khau = hk['SoHoKhau'] if 'SoHoKhau' in hk else hk.get('SoHoKhau')

    # Get list
    r3 = client.get('/api/ho-khau/', headers=headers)
    assert r3.status_code == 200
    j = r3.get_json()
    assert any(item['SoHoKhau'] == so_ho_khau for item in j)

    # Get by id
    r4 = client.get(f'/api/ho-khau/{so_ho_khau}', headers=headers)
    assert r4.status_code == 200
    j4 = r4.get_json()
    assert j4['ChuHoID'] == chu_ho_id

    # Update
    r5 = client.put(f'/api/ho-khau/{so_ho_khau}', json={'SoNha': '99'}, headers=headers)
    assert r5.status_code == 200
    j5 = r5.get_json()
    # returned structure may be object
    assert j5.get('SoNha') == '99' or j5.get('data', {}).get('SoNha') == '99'

    # Delete
    r6 = client.delete(f'/api/ho-khau/{so_ho_khau}', headers=headers)
    assert r6.status_code == 200

    # Ensure deleted
    r7 = client.get(f'/api/ho-khau/{so_ho_khau}', headers=headers)
    assert r7.status_code == 404

