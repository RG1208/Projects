from flask import Flask, jsonify #type:ignore
from config import Config
from flask_cors import CORS  # type: ignore
from models.extensions import db  
from models import *  
from flask_jwt_extended import JWTManager  # type: ignore
from routes.auth import login_bp, register_bp
from routes.teacher import teacher_bp
from routes.student import student_bp
from flask_migrate import Migrate #type:ignore


app = Flask(__name__)
app.config.from_object(Config)
migrate = Migrate(app, db) # type: ignore

CORS(app, resources={r"/*": {"origins": "https://learnify-khaki-chi.vercel.app"}}, supports_credentials=True)

db.init_app(app)
jwt = JWTManager(app)

@app.route('/', methods=['GET'])
def index():
    """Health check route"""
    return jsonify({'message': 'API is working', 'status': 'success'}), 200

app.register_blueprint(login_bp, url_prefix='/api')  # adds '/api' before every route
app.register_blueprint(register_bp, url_prefix='/api')  # adds '/api' before every route
app.register_blueprint(teacher_bp, url_prefix='/api/teacher')  # adds '/api' before every route
app.register_blueprint(student_bp, url_prefix='/api/student')  # adds '/api/student' before every route

with app.app_context():
    db.create_all()

if __name__ == '__main__':  
    app.run(debug=True)