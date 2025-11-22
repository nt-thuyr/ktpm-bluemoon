from ..routes.auth import auth_bp
from ..routes.fees import fees_bp
from ..routes.payments import payments_bp
from ..routes.households import households_bp
from ..routes.nhan_khau import nhan_khau_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(fees_bp, url_prefix="/fees")
    app.register_blueprint(payments_bp, url_prefix="/payments")
    app.register_blueprint(households_bp, url_prefix="/households")

    app.register_blueprint(nhan_khau_bp, url_prefix="/nhan-khau")