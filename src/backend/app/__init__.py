from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors
from .routes import register_routes
from . import models

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    
    app.config.from_object(Config)
    app.config.from_pyfile("config.py", silent=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    register_routes(app)

    # test home page
    @app.route("/")
    def index():
        return {"message": "Backend is running"}

    return app
