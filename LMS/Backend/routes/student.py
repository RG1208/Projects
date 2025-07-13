from flask import Blueprint, request, jsonify #type:ignore
from models.assignment import Assignment
from models.lecture import Lecture
from models.submission import Submission
from models.enrollment import Enrollment
from flask_jwt_extended import get_jwt_identity # type: ignore
from utils.singleDecorator import role_required
from models.course import Course
from models.extensions import db
from models.user import User
from flask_jwt_extended import jwt_required  # type: ignore
from datetime import datetime

student_bp = Blueprint('student', __name__)

# Get list of all courses posted by teachers
@student_bp.route('/courses', methods=['GET'])
@jwt_required()
@role_required('student')
def get_all_courses():
    courses = Course.query.all()
    course_list = [course.to_dict() for course in courses]
    
    return jsonify(course_list), 200

# Enroll in a course
@student_bp.route('/courses/<int:course_id>/enroll', methods=['POST'])
@jwt_required()
@role_required('student')
def enroll_in_course(course_id):
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)
    
    if not course:
        return jsonify({"message": "Course not found"}), 404
    
    if user_id in [student.id for student in course.students]:
        return jsonify({"message": "Already enrolled in this course"}), 400

    course.students.append(User.query.get(user_id))
    db.session.commit()
    
    return jsonify({"message": "Enrolled in course successfully"}), 200

# Unenroll from a course
@student_bp.route('/courses/<int:course_id>/unenroll', methods=['POST'])
@jwt_required()
@role_required('student')
def unenroll_from_course(course_id):
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"message": "Course not found"}), 404

    student = User.query.get(user_id)

    if student not in course.students:
        return jsonify({"message": "You are not enrolled in this course"}), 400

    course.students.remove(student)
    db.session.commit()

    return jsonify({"message": "Unenrolled from course successfully"}), 200


# Get list of courses the student is enrolled in
@student_bp.route('/my-courses', methods=['GET'])
@jwt_required()
@role_required('student')
def get_courses():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    courses = Course.query.filter(Course.students.any(id=user_id)).all()
    course_list = [course.to_dict() for course in courses]
    
    return jsonify(course_list), 200

# Get details of a specific course the student is enrolled in
@student_bp.route('/my-courses/<int:course_id>', methods=['GET'])
@jwt_required()
@role_required('student')
def get_course(course_id):
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"message": "Course not found"}), 404

    from models.enrollment import Enrollment
    enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not enrollment:
        return jsonify({"message": "Access denied"}), 403

    return jsonify(course.to_dict()), 200

# Get assignments for courses the student is enrolled in
@student_bp.route('/my-courses/assignments', methods=['GET'])
@jwt_required()
@role_required('student')
def get_assignments():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    courses = Course.query.filter(Course.students.any(id=user_id)).all()
    assignments = []
    
    for course in courses:
        course_assignments = Assignment.query.filter_by(course_id=course.id).all()
        for assignment in course_assignments:
            assignments.append(assignment.to_dict())
    
    return jsonify(assignments), 200

# Get details of a specific assignment for courses the student is enrolled in
@student_bp.route('/my-courses/assignments/<int:assignment_id>', methods=['GET'])
@jwt_required()
@role_required('student')
def get_assignment(assignment_id):
    user_id = get_jwt_identity()
    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"message": "Assignment not found"}), 404

    # Check if the user is enrolled in the assignment's course
    is_enrolled = Enrollment.query.filter_by(user_id=user_id, course_id=assignment.course_id).first()

    if not is_enrolled:
        return jsonify({"message": "Access denied"}), 403

    return jsonify(assignment.to_dict()), 200

# Submit an assignment for courses the student is enrolled in
@student_bp.route('/my-courses/assignments/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
@role_required('student')
def submit_assignment(assignment_id):
    user_id = get_jwt_identity()
    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"message": "Assignment not found"}), 404

    # Check if the student is enrolled in the course
    is_enrolled = Enrollment.query.filter_by(user_id=user_id, course_id=assignment.course_id).first()
    if not is_enrolled:
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    content = data.get('content')
    if not content:
        return jsonify({"message": "Assignment content is required"}), 400

    submission = Submission(
        user_id=user_id,
        assignment_id=assignment_id,
        content=content,
        submitted_at=datetime.utcnow()
    )

    db.session.add(submission)
    db.session.commit()

    return jsonify({"message": "Submission successful"}), 201

# Get submissions for a specific assignment for courses the student is enrolled in
@student_bp.route('/my-courses/assignments/<int:assignment_id>/submissions', methods=['GET'])
@jwt_required()
@role_required('student')
def get_submissions(assignment_id):
    user_id = get_jwt_identity()
    assignment = Assignment.query.get(assignment_id)
    
    if not assignment:
        return jsonify({"message": "Assignment not found"}), 404

    enrolled = db.session.query(Enrollment).filter_by(
        user_id=user_id,
        course_id=assignment.course_id
    ).first()

    if not enrolled:
        return jsonify({"message": "Access denied"}), 403

    submissions = Submission.query.filter_by(assignment_id=assignment_id, user_id=user_id).all()
    submission_list = [submission.to_dict() for submission in submissions]
    
    return jsonify(submission_list), 200


# Get lectures for courses the student is enrolled in
@student_bp.route('/my-courses/<int:course_id>/lectures', methods=['GET'])
@jwt_required()
@role_required('student')
def get_lectures(course_id):
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)
    
    if not course:
        return jsonify({"message": "Course not found"}), 404
    
    enrolled = db.session.query(Enrollment).filter_by(course_id=course_id, user_id=user_id).first()
    if not enrolled:
        return jsonify({"message": "Access denied"}), 403

    lectures = Lecture.query.filter_by(course_id=course_id).all()
    lecture_list = [lecture.to_dict() for lecture in lectures]
    
    return jsonify(lecture_list), 200

# Get details of a specific lecture for courses the student is enrolled in
@student_bp.route('/my-courses/<int:course_id>/lectures/<int:lecture_id>', methods=['GET'])
@jwt_required()
@role_required('student')
def get_lecture(course_id, lecture_id):
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)
    
    if not course:
        return jsonify({"message": "Course not found"}), 404
    
    enrolled = db.session.query(Enrollment).filter_by(course_id=course_id, user_id=user_id).first()
    if not enrolled:
        return jsonify({"message": "Access denied"}), 403


    lecture = Lecture.query.get(lecture_id)
    
    if not lecture or lecture.course_id != course_id:
        return jsonify({"message": "Lecture not found"}), 404

    return jsonify(lecture.to_dict()), 200

#get profile
@student_bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required('student')
def get_profile():  
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user.to_dict()), 200

# Update student profile
@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
@role_required('student')
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    
    db.session.commit()
    
    return jsonify({"message": "Profile updated successfully"}), 200

# Delete student profile
@student_bp.route('/profile', methods=['DELETE'])
@jwt_required() 
@role_required('student')
def delete_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "Profile deleted successfully"}), 200


#Student Stats
@student_bp.route('/stats', methods=['GET'])
@jwt_required()
@role_required('student')
def get_student_stats():
    student_id = get_jwt_identity()

    # 1. Fetch enrollments of this student
    enrollments = Enrollment.query.filter_by(user_id=student_id).all()
    enrolled_course_ids = [enr.course_id for enr in enrollments]
    total_courses_enrolled = len(enrolled_course_ids)

    # 2. Fetch enrolled course names (optional)
    courses = Course.query.filter(Course.id.in_(enrolled_course_ids)).all()
    enrolled_course_names = [course.title for course in courses]

    # 3. Count total assignments in enrolled courses (optional)
    assignments = Assignment.query.filter(Assignment.course_id.in_(enrolled_course_ids)).all()
    total_assignments = len(assignments)

    return jsonify({
        "message": "Student stats retrieved successfully",
        "total_courses_enrolled": total_courses_enrolled,
        "enrolled_courses": enrolled_course_names,   # Optional, remove if not needed
        "total_assignments": total_assignments       # Optional, remove if not needed
    }), 200
