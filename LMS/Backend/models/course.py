from enum import Enum as PyEnum
from .extensions import db

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    teacher = db.relationship('User', backref=db.backref('courses', lazy=True))

    def __repr__(self):
        return f'<Course {self.title}>'