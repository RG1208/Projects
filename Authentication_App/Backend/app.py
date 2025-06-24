from flask import Flask
from config import Config 
from flask_cors import CORS # type: ignore
from routes.register import register_bp 
from routes.login import login_bp 
from flask_jwt_extended import JWTManager # type: ignore
from models import db # type: ignore

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Initialize the database and JWT manager
db.init_app(app)
JWTManager(app) 

app.register_blueprint(register_bp)
app.register_blueprint(login_bp)


with app.app_context():
    db.create_all()

if __name__ == '__main__':  
    app.run(debug=True)