/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState({});
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(localStorage.getItem("current_course_id") || "");
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", courseId: "" });
  const [editAssignment, setEditAssignment] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      localStorage.setItem("current_course_id", selectedCourseId);
      fetchAssignments();
    }
  }, [selectedCourseId]);

  const fetchCourses = () => {
    fetch("http://localhost:5000/api/teacher/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        if (!selectedCourseId && data.courses.length > 0) {
          setSelectedCourseId(data.courses[0].id);
        }
        setNewAssignment((prev) => ({ ...prev, courseId: data.courses[0]?.id || "" }));
      });
  };

  const fetchAssignments = () => {
    fetch(`http://localhost:5000/api/teacher/courses/${selectedCourseId}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.assignments.reduce((acc, a) => {
          if (!acc[a.course_id]) acc[a.course_id] = [];
          acc[a.course_id].push(a);
          return acc;
        }, {});
        setAssignments(grouped);
      });
  };

  const handleChange = (e, setState, state) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const addAssignment = async () => {
    if (!newAssignment.courseId) return alert("Please select a course!");

    await fetch(`http://localhost:5000/api/teacher/courses/${newAssignment.courseId}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newAssignment.title,
        description: newAssignment.description,
      }),
    });

    setNewAssignment({ title: "", description: "", courseId: courses[0]?.id || "" });
    fetchAssignments();
  };

  const updateAssignment = async () => {
    await fetch(`http://localhost:5000/api/teacher/assignments/${editAssignment.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editAssignment.title,
        description: editAssignment.description,
      }),
    });

    setEditAssignment(null);
    fetchAssignments();
  };

  const deleteAssignment = async (assignmentId) => {
    const confirm = window.confirm("Delete this assignment?");
    if (!confirm) return;

    await fetch(`http://localhost:5000/api/teacher/courses/${selectedCourseId}/assignments/${assignmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchAssignments();
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-purple-700">📑 Assignments</h2>

        {/* Course Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
          <label className="block font-medium text-gray-700">🎓 Select Course to View Assignments:</label>
          <select
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Add Assignment */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-800">➕ Add New Assignment</h3>
          <select
            name="courseId"
            value={newAssignment.courseId}
            onChange={(e) => handleChange(e, setNewAssignment, newAssignment)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            name="title"
            placeholder="Assignment Title"
            value={newAssignment.title}
            onChange={(e) => handleChange(e, setNewAssignment, newAssignment)}
            className="w-full p-3 border rounded-xl"
          />
          <textarea
            name="description"
            placeholder="Assignment Description"
            value={newAssignment.description}
            onChange={(e) => handleChange(e, setNewAssignment, newAssignment)}
            className="w-full p-3 border rounded-xl"
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl transition"
            onClick={addAssignment}
          >
            Add Assignment
          </button>
        </div>

        {/* Assignment List */}
        {Object.entries(assignments).map(([courseId, items]) => (
          <div key={courseId} className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-700">
              📘 Course ID: {courseId}
            </h4>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow flex justify-between items-start gap-4"
              >
                {editAssignment?.id === item.id ? (
                  <div className="flex-1 space-y-3">
                    <input
                      name="title"
                      value={editAssignment.title}
                      onChange={(e) => handleChange(e, setEditAssignment, editAssignment)}
                      className="w-full p-2 border rounded-xl"
                    />
                    <textarea
                      name="description"
                      value={editAssignment.description}
                      onChange={(e) => handleChange(e, setEditAssignment, editAssignment)}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-purple-700">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                )}
                <div className="space-x-2">
                  {editAssignment?.id === item.id ? (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-xl"
                        onClick={updateAssignment}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded-xl"
                        onClick={() => setEditAssignment(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-xl"
                        onClick={() => setEditAssignment(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded-xl"
                        onClick={() => deleteAssignment(item.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-green-600 text-white px-4 py-1 rounded-xl"
                        onClick={() => navigate(`/teacher/assignments/${item.id}/submissions`)}
                      >
                        View Submissions
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
