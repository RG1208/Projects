from flask import Blueprint, request, jsonify
from models.assignment import Assignment
from models.lecture import Lecture
from models.submission import Submission
from flask_jwt_extended import get_jwt_identity # type: ignore
from utils.singleDecorator import role_required
from models.course import Course
from models.extensions import db
from models.user import User
from flask_jwt_extended import jwt_required  # type: ignore
from datetime import datetime

teacher_bp = Blueprint('course', __name__)

# GET all courses
@teacher_bp.route('/courses', methods=['GET'])
@jwt_required()
@role_required('teacher')
def get_courses():
    try:
        courses = Course.query.all()
        course_list = [{
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'teacher_id': course.teacher_id,
            'teacher_name': course.teacher.name if course.teacher else None
        } for course in courses]

        return jsonify({
            'message': 'Courses retrieved successfully',
            'courses': course_list
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# CREATE a new course
@teacher_bp.route('/courses', methods=['POST'])
@jwt_required()
@role_required('teacher')
def create_course():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        teacher_id = get_jwt_identity()  # Securely from token

        if not title or not description:
            return jsonify({"message": "Title and description are required"}), 400

        new_course = Course(
            title=title,
            description=description,
            teacher_id=teacher_id
        )
        db.session.add(new_course)
        db.session.commit()

        return jsonify({
            "message": "Course created successfully",
            "course": {
                "id": new_course.id,
                "title": new_course.title,
                "description": new_course.description,
                "teacher_id": new_course.teacher_id
            }
        }), 201
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# UPDATE course
@teacher_bp.route('/courses/<int:course_id>', methods=['PUT'])
@jwt_required()
@role_required('teacher')
def update_course(course_id):
    try:
        data = request.get_json()
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"message": "Course not found"}), 404

        course.title = data.get('title', course.title)
        course.description = data.get('description', course.description)

        db.session.commit()

        return jsonify({
            "message": "Course updated successfully",
            "course": {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "teacher_id": course.teacher_id
            }
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# DELETE course
@teacher_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
@role_required('teacher')
def delete_course(course_id):
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"message": "Course not found"}), 404

        db.session.delete(course)
        db.session.commit()

        return jsonify({"message": "Course deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# GET one course by ID
@teacher_bp.route('/courses/<int:course_id>', methods=['GET'])
@jwt_required()
@role_required('teacher')
def get_course(course_id):
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"message": "Course not found"}), 404

        return jsonify({
            "message": "Course retrieved successfully",
            "course": {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "teacher_id": course.teacher_id,
                "teacher_name": course.teacher.name if course.teacher else None
            }
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500
    
#Get students in a course
@teacher_bp.route('/courses/<int:course_id>/students', methods=['GET'])
@jwt_required()
@role_required('teacher')
def get_students_in_course(course_id):  
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"message": "Course not found"}), 404

        students = [enrollment.user for enrollment in course.enrollments]

        student_list = [{
            'id': student.id,
            'name': student.name,
            'email': student.email
        } for student in students]

        return jsonify({
            'message': 'Students retrieved successfully',
            'students': student_list
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# create Assignment 
@teacher_bp.route('/courses/<int:course_id>/assignments', methods=['POST'])
@jwt_required()
@role_required('teacher')
def create_assignment(course_id):
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        due_date_str = data.get('due_date')

        if not title or not description:
            return jsonify({"message": "Title and description are required"}), 400

        # Parse due_date string to datetime object
        due_date = None
        if due_date_str:
            try:
                due_date = datetime.strptime(due_date_str, "%Y-%m-%d")  # e.g., "2025-07-02"
            except ValueError:
                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        new_assignment = Assignment(
            title=title,
            description=description,
            course_id=course.id,
            due_date=due_date
        )
        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({
            "message": "Assignment created successfully",
            "assignment": {
                "id": new_assignment.id,
                "title": new_assignment.title,
                "description": new_assignment.description,
                "course_id": new_assignment.course_id,
                "due_date": new_assignment.due_date.isoformat() if new_assignment.due_date else None
            }
        }), 201
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# Get Assignments in a course
@teacher_bp.route('/courses/<int:course_id>/assignments', methods=['GET'])
@jwt_required()
@role_required('teacher')
def get_assignments(course_id): 
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"message": "Course not found"}), 404

        assignments = course.assignments

        assignment_list = [{
            'id': assignment.id,
            'title': assignment.title,
            'description': assignment.description,
            'due_date': assignment.due_date.isoformat() if assignment.due_date else None
        } for assignment in assignments]

        return jsonify({
            'message': 'Assignments retrieved successfully',
            'assignments': assignment_list
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500
    
# Delete Assignment
@role_required('teacher')
@teacher_bp.route('/courses/<int:course_id>/assignments/<int:assignment_id>', methods=['DELETE'])
def delete_assignment(course_id, assignment_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        assignment = Assignment.query.get(assignment_id)
        if not assignment or assignment.course_id != course.id:
            return jsonify({"message": "Assignment not found"}), 404

        db.session.delete(assignment)
        db.session.commit()

        return jsonify({"message": "Assignment deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500
    
# Update Assignment
from datetime import datetime

@teacher_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
@jwt_required()
@role_required('teacher')
def update_assignment(assignment_id):
    try:
        data = request.get_json()
        assignment = Assignment.query.get(assignment_id)

        if not assignment:
            return jsonify({"message": "Assignment not found"}), 404

        assignment.title = data.get('title', assignment.title)
        assignment.description = data.get('description', assignment.description)

        due_date_str = data.get('due_date')
        if due_date_str:
            try:
                assignment.due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
            except ValueError:
                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

        db.session.commit()

        return jsonify({
            "message": "Assignment updated successfully",
            "assignment": {
                "id": assignment.id,
                "title": assignment.title,
                "description": assignment.description,
                "due_date": assignment.due_date.isoformat() if assignment.due_date else None
            }
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500


# Get Submissions for an Assignment
@teacher_bp.route('/submissions/<int:assignment_id>', methods=['GET'])
@jwt_required()
@role_required('teacher')
def get_submissions(assignment_id):
    try:
        assignment = Assignment.query.get(assignment_id)

        if not assignment:
            return jsonify({"message": "Assignment not found"}), 404

        submissions = assignment.submissions

        submission_list = [{
            'id': submission.id,
            'user_id': submission.user_id,
            'content': submission.content,
            'marks': submission.marks,
            'feedback': submission.feedback,
            'status': submission.status
        } for submission in submissions]

        return jsonify({
            'message': 'Submissions retrieved successfully',
            'submissions': submission_list
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# Grade Submission
@teacher_bp.route('/grade_submission/<int:submission_id>', methods=['POST'])
@jwt_required()
@role_required('teacher')
def grade_submission(submission_id):
    try:
        data = request.get_json()
        marks = data.get('marks')
        feedback = data.get('feedback')

        if marks is None or feedback is None:
            return jsonify({"message": "Marks and feedback are required"}), 400

        submission = Submission.query.get(submission_id)

        if not submission:
            return jsonify({"message": "Submission not found"}), 404

        submission.marks = marks
        submission.feedback = feedback
        submission.status = 'graded'

        db.session.commit()

        return jsonify({
            "message": "Submission graded successfully",
            "submission": {
                "id": submission.id,
                "marks": submission.marks,
                "feedback": submission.feedback,
                "status": submission.status
            }
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# Create Lecture
@teacher_bp.route('/courses/<int:course_id>/lectures', methods=['POST'])
@jwt_required()
@role_required('teacher')
def create_lecture(course_id):
    try:
        data = request.get_json()
        title = data.get('title')
        video_url = data.get('video_url')

        if not title or not video_url:
            return jsonify({"message": "Title and video URL are required"}), 400

        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        new_lecture = Lecture(
            title=title,
            video_url=video_url,
            course_id=course.id
        )
        db.session.add(new_lecture)
        db.session.commit()

        return jsonify({
            "message": "Lecture created successfully",
            "lecture": {
                "id": new_lecture.id,
                "title": new_lecture.title,
                "video_url": new_lecture.video_url,
                "course_id": new_lecture.course_id
            }
        }), 201
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# Get Lectures in a course    
@role_required('teacher')
@teacher_bp.route('/courses/<int:course_id>/lectures', methods=['GET'])
def get_lectures(course_id):
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"message": "Course not found"}), 404

        lectures = course.lectures

        lecture_list = [{
            'id': lecture.id,
            'title': lecture.title,
            'video_url': lecture.video_url,
            'course_id': lecture.course_id
        } for lecture in lectures]

        return jsonify({
            'message': 'Lectures retrieved successfully',
            'lectures': lecture_list
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# Delete Lecture
@role_required('teacher')
@teacher_bp.route('/courses/<int:course_id>/lectures/<int:lecture_id>', methods=['DELETE'])
def delete_lecture(course_id, lecture_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        lecture = Lecture.query.get(lecture_id)
        if not lecture or lecture.course_id != course.id:
            return jsonify({"message": "Lecture not found"}), 404

        db.session.delete(lecture)
        db.session.commit()

        return jsonify({"message": "Lecture deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

# Update Lecture 
@role_required('teacher')
@teacher_bp.route('/courses/<int:course_id>/lectures/<int:lecture_id>', methods=['PUT'])
def update_lecture(course_id, lecture_id):
    try:
        data = request.get_json()
        lecture = Lecture.query.get(lecture_id)

        if not lecture or lecture.course_id != course_id:
            return jsonify({"message": "Lecture not found"}), 404

        lecture.title = data.get('title', lecture.title)
        lecture.video_url = data.get('video_url', lecture.video_url)

        db.session.commit()

        return jsonify({
            "message": "Lecture updated successfully",
            "lecture": {
                "id": lecture.id,
                "title": lecture.title,
                "video_url": lecture.video_url,
                "course_id": lecture.course_id
            }
        }), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "error": str(e)}), 500

