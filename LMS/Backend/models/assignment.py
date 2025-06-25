from enum import Enum as PyEnum
from flask_sqlalchemy import SQLAlchemy # type: ignore

db = SQLAlchemy()

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())

    course = db.relationship('Course', backref=db.backref('assignments', lazy=True))

    def __repr__(self):
        return f'<Assignment {self.title} for {self.course.title}>'