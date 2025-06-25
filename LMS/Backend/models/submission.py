from enum import Enum as PyEnum
from flask_sqlalchemy import SQLAlchemy # type: ignore
from sqlalchemy import Enum as SQLAEnum  # type: ignore

db = SQLAlchemy()

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
