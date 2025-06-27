from enum import Enum as PyEnum
from .extensions import db
from sqlalchemy import Enum as SQLAEnum  # type: ignore

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
    file_url = db.Column(db.String(200), nullable=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, server_default=db.func.now())
    marks = db.Column(db.Float, nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    status = db.Column(SQLAEnum('submitted', 'graded','not submitted', name='submission_status_enum'), default='submitted')

    assignment = db.relationship('Assignment', backref=db.backref('submissions', lazy=True))
    user = db.relationship('User', backref=db.backref('submissions', lazy=True))

    def __repr__(self):
        return f'<Submission assignment_id={self.assignment_id} user_id={self.user_id}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "assignment_id": self.assignment_id,
            "user_id": self.user_id,
            "file_url": self.file_url,
            "content": self.content,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "marks": self.marks,
            "feedback": self.feedback,
            "status": self.status
        }