from ..routes.auth import auth_bp
from ..routes.nhan_khau import nhan_khau_bp
from ..routes.ho_khau import ho_khau_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(nhan_khau_bp, url_prefix="/api/nhan-khau")
    app.register_blueprint(ho_khau_bp, url_prefix="/api/ho-khau")
