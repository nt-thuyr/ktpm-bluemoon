from ..routes.auth import auth_bp
from ..routes.nhan_khau import nhan_khau_bp
from ..routes.ho_khau import ho_khau_bp
from ..routes.tam_tru import tam_tru_bp
from ..routes.khoan_thu import khoan_thu_bp
from ..routes.nop_tien import nop_tien_bp
from ..routes.thong_ke import thong_ke_bp


def register_routes(app):
    # Auth & Dân cư
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(nhan_khau_bp, url_prefix="/api/nhan-khau")
    app.register_blueprint(ho_khau_bp, url_prefix="/api/ho-khau")
    app.register_blueprint(tam_tru_bp, url_prefix="/api/tam-tru")

    # Quản lý phí & Đóng tiền
    app.register_blueprint(khoan_thu_bp, url_prefix="/api/khoan-thu")
    app.register_blueprint(nop_tien_bp, url_prefix="/api/nop-tien")

    # Thống kê
    app.register_blueprint(thong_ke_bp, url_prefix="/api/thong-ke")