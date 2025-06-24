from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token  # type: ignore
from models import db, User

register_bp = Blueprint('register', __name__)

@register_bp.route('/register',methods=['POST'])
def register():

    data =request.get_json()
    existing_user= User.query.filter_by(email=data.get('email')).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user= User(
        name=data['name'],
        email=data['email'],
        username=data['username'],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity={
        'id': new_user.id,
        'email': new_user.email,
        'username': new_user.username,
        'name': new_user.name
    })

    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'username': new_user.username,
        'email': new_user.email,
        'name': new_user.name
    }), 201