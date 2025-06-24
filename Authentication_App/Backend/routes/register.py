from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token # type: ignore
from models import db, User

register_bp = Blueprint('register', __name__)

@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Extract data
    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # default to 'user' if not provided

    if not email or not password or not username or not name:
        return jsonify({"message": "All fields are required"}), 400

    # Check for duplicate user
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Create new user
    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        username=username,
        password=hashed_password,
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    # Create JWT token with role
    access_token = create_access_token(identity=new_user.id, additional_claims={
        'email': new_user.email,
        'username': new_user.username,
        'name': new_user.name,
        'role': new_user.role
    })

    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user_id': new_user.id,
        'username': new_user.username,
        'email': new_user.email,
        'name': new_user.name,
        'role': new_user.role
    }), 201
