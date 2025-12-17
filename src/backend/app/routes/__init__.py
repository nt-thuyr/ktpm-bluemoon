from .nop_tien import nop_tien_bp
from ..routes.auth import auth_bp
from ..routes.fees import fees_bp
from ..routes.payments import payments_bp
from ..routes.households import households_bp
from ..routes.nhan_khau import nhan_khau_bp
from ..routes.khoan_thu import khoan_thu_bp
from ..routes.nop_tien import nop_tien_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(fees_bp, url_prefix="/fees")
    app.register_blueprint(payments_bp, url_prefix="/payments")
    app.register_blueprint(households_bp, url_prefix="/households")

    app.register_blueprint(nhan_khau_bp, url_prefix="/nhan-khau")
    app.register_blueprint(khoan_thu_bp, url_prefix="/khoan-thu")
    app.register_blueprint(nop_tien_bp, url_prefix="/nop-tien")