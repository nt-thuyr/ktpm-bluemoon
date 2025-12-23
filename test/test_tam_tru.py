def test_tam_tru_create_via_service(client, token_to_truong):
    headers = {'Authorization': f'Bearer {token_to_truong}'}

    # Create resident first
    r = client.post('/api/nhan-khau/', json={'HoTen': 'Tam Tru Test', 'NgaySinh': '1995-06-06'}, headers=headers)
    assert r.status_code == 201
    nk = r.get_json()['data']
    nk_id = nk['id']

    # Call service to create tam tru record
    from src.backend.app.services.tam_tru_service import create_tamtru
    from src.backend.app.models.tam_tru_tam_vang import TamTruTamVang
    from src.backend.app.extensions import db

    with client.application.app_context():
        res = create_tamtru({
            'nhan_khau_id': nk_id,
            'trang_thai': 'tạm trú',
            'dia_chi': '123 Đường Test',
            'thoi_gian': '2025-12-01',
            'noi_dung_de_nghi': 'Đăng ký tạm trú'
        })

        assert res is not None

        # Verify record persisted
        rec = TamTruTamVang.query.filter_by(nhan_khau_id=nk_id).first()
        assert rec is not None
        assert rec.trang_thai == 'tạm trú'

