from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token # type: ignore
from models import User
from datetime import timedelta

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Invalid email or password."}), 401

        access_token = create_access_token(
            identity=user.id,
            additional_claims={
                'email': user.email,
                'username': user.username,
                'name': user.name,
                'role': user.role
            },
            expires_delta=timedelta(days=1)
        )

        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'role': user.role
        }), 200

    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500
