from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors
from .routes import register_routes
from . import models

# 1. Thêm tham số config_class, mặc định là Config (để chạy bình thường vẫn ok)
def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)

    # 2. Dùng biến config_class được truyền vào thay vì class Config cứng
    app.config.from_object(config_class)

    # (Tùy chọn) Chỉ load config từ file instance nếu không phải đang Test
    if not app.config.get("TESTING"):
        app.config.from_pyfile("config.py", silent=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    register_routes(app)

    @app.route("/")
    def index():
        return {"message": "Backend is running"}

    return app