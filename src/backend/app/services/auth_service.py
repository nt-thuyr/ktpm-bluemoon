import time
import jwt
from flask import current_app
from .data_service import find_user_by_username, get_user

def create_token(user):
    payload = {
        'sub': user['id'],
        'username': user['username'],
        'role': user['role'],
        'iat': int(time.time()),
        'exp': int(time.time()) + 60 * 60 * 24  # token valid 24h
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    # PyJWT returns str in v2+; ensure we return string
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token


def decode_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user = get_user(payload['sub'])
        return user, payload
    except jwt.ExpiredSignatureError:
        return None, 'expired'
    except Exception as e:
        return None, str(e)
