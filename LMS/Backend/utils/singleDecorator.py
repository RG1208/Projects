from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt # type: ignore
from flask import jsonify

def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt()
                if claims.get("role") != required_role:
                    return jsonify({"message": "Unauthorized - Invalid role"}), 403
            except Exception as e:
                return jsonify({"message": "JWT Error", "error": str(e)}), 401
            return fn(*args, **kwargs)
        return wrapper
    return decorator
