def test_nhan_khau_crud(client, token_to_truong):
    headers = {'Authorization': f'Bearer {token_to_truong}'}

    # Create
    payload = {
        'HoTen': 'Nguyen Van A',
        'NgaySinh': '1990-01-01',
        'GioiTinh': 'Nam'
    }
    r = client.post('/api/nhan-khau/', json=payload, headers=headers)
    assert r.status_code == 201
    data = r.get_json()
    assert data['data']['HoTen'] == 'Nguyen Van A'
    nk_id = data['data']['id']

    # Get list
    r2 = client.get('/api/nhan-khau/', headers=headers)
    assert r2.status_code == 200
    j = r2.get_json()
    assert any(item['id'] == nk_id for item in j['data'])

    # Get by id
    r3 = client.get(f'/api/nhan-khau/{nk_id}', headers=headers)
    assert r3.status_code == 200
    j3 = r3.get_json()
    assert j3['HoTen'] == 'Nguyen Van A'

    # Update
    r4 = client.put(f'/api/nhan-khau/{nk_id}', json={'HoTen': 'Updated A'}, headers=headers)
    assert r4.status_code == 200
    j4 = r4.get_json()
    assert j4['data']['HoTen'] == 'Updated A'

    # Delete
    r5 = client.delete(f'/api/nhan-khau/{nk_id}', headers=headers)
    assert r5.status_code == 200

    # Ensure deleted
    r6 = client.get(f'/api/nhan-khau/{nk_id}', headers=headers)
    assert r6.status_code == 404

