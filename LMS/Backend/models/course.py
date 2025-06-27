from .extensions import db
from .user import User
from .enrollment import Enrollment

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    teacher = db.relationship('User', backref=db.backref('courses', lazy=True))

    # Many-to-many relationship with User through Enrollment
    students = db.relationship(
        'User',
        secondary='enrollment',
        primaryjoin='Course.id == Enrollment.course_id',
        secondaryjoin='User.id == Enrollment.user_id',
        backref='enrolled_courses'
    )

    def __repr__(self):
        return f'<Course {self.title}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "teacher_id": self.teacher_id,
            "teacher_name": self.teacher.name if self.teacher else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
