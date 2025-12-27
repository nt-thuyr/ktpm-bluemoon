from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()

# Trong thực tế nên dùng Redis. Ở đây dùng set() lưu trên RAM để demo.
# Lưu ý: Khi restart server, set này sẽ mất (token cũ lại dùng được).
jwt_blocklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in jwt_blocklist

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# 1. Định nghĩa quy tắc đặt tên (Naming Convention)
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

# 2. Gắn quy tắc này vào MetaData
metadata = MetaData(naming_convention=convention)

# 3. Truyền metadata vào SQLAlchemy
db = SQLAlchemy(metadata=metadata)