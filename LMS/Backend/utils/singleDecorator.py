from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt # type: ignore

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()  # ensure JWT is present
            claims = get_jwt()

            if claims.get('role') != required_role:
                return jsonify({"msg": "Access denied: Insufficient role"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper
