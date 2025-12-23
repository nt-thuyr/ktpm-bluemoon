def test_login_success(client):
    resp = client.post('/api/auth/dang-nhap', json={'username': 'to_truong', 'password': 'password'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'access_token' in data
    assert data['profile']['vai_tro'] == 'Tổ trưởng'


def test_change_password_and_login(client, token_to_truong):
    headers = {'Authorization': f'Bearer {token_to_truong}'}
    # change password
    resp = client.post('/api/auth/doi-mat-khau', headers=headers, json={
        'mat_khau_hien_tai': 'password', 'mat_khau_moi': 'newpass'
    })
    assert resp.status_code == 200

    # old password should fail
    r_old = client.post('/api/auth/dang-nhap', json={'username': 'to_truong', 'password': 'password'})
    assert r_old.status_code == 401

    # new password should work
    r_new = client.post('/api/auth/dang-nhap', json={'username': 'to_truong', 'password': 'newpass'})
    assert r_new.status_code == 200


def test_logout_revokes_token(client, token_to_truong):
    headers = {'Authorization': f'Bearer {token_to_truong}'}
    resp = client.delete('/api/auth/dang-xuat', headers=headers)
    assert resp.status_code == 200

    # subsequent access with same token should be rejected
    r = client.get('/api/nhan-khau/', headers=headers)
    assert r.status_code in (401, 422)