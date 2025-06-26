from .extensions import db
from datetime import datetime

class Lecture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    video_url = db.Column(db.String(500), nullable=False)  # Cloudinary URL
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())

    course = db.relationship('Course', backref=db.backref('lectures', lazy=True))

    def __repr__(self):
        return f"<Lecture {self.title}>"
