from enum import Enum as PyEnum
from sqlalchemy import Enum as SQLAEnum  # type: ignore
from .extensions import db

ROLE_TYPES = ('student', 'teacher', 'admin')

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(SQLAEnum(*ROLE_TYPES, name="role_enum"), nullable=False, default='student')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f'<User {self.name}>'