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

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "video_url": self.video_url,
            "course_id": self.course_id,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None
        }
