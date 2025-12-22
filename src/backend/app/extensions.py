from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

# Trong thực tế nên dùng Redis. Ở đây dùng set() lưu trên RAM để demo.
# Lưu ý: Khi restart server, set này sẽ mất (token cũ lại dùng được).
jwt_blocklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in jwt_blocklist