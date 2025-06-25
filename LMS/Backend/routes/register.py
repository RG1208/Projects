from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token # type: ignore
from models.extensions import db
from models.user import User

register_bp = Blueprint('register', __name__)

@register_bp.route('/register', methods=['POST'])
def register():
    data= request.get_json()

    # Extract data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')  # default to 'student' if not provided

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "User already exists"}), 400

    if not email or not password or not name:
        return jsonify({"message": "All fields are required"}), 400

    # Create new user
    new_user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user_id": new_user.id,
        "email": new_user.email,
        "name": new_user.name,
        "role": new_user.role
    }), 201