from flask import Flask

from .routes.auth import auth_bp
from .routes.fees import fees_bp
from .routes.payments import payments_bp
from .routes.households import households_bp


def create_app():
    app = Flask(__name__)
    # Secret for JWT signing (in real production store securely)
    app.config['SECRET_KEY'] = 'change-me-to-a-secure-random-secret'

    # register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(fees_bp, url_prefix='/fees')
    app.register_blueprint(payments_bp, url_prefix='/payments')
    app.register_blueprint(households_bp, url_prefix='/households')

    return app
