/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

export default function TeacherLectures() {
  const [lectures, setLectures] = useState({});
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(localStorage.getItem("current_course_id") || "");
  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    video_url: "",
    courseId: "",
  });
  const [editLecture, setEditLecture] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      localStorage.setItem("current_course_id", selectedCourseId);
      fetchLectures();
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
      });
  };

  const fetchLectures = () => {
    fetch(`http://localhost:5000/api/teacher/courses/${selectedCourseId}/lectures`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.lectures) {
          console.error("API error or lectures missing:", data);
          setLectures({});
          return;
        }
        const grouped = data.lectures.reduce((acc, l) => {
          if (!acc[l.course_id]) acc[l.course_id] = [];
          acc[l.course_id].push(l);
          return acc;
        }, {});
        setLectures(grouped);
      })
      .catch((error) => {
        console.error("Failed to fetch lectures:", error);
      });
  };

  const handleChange = (e, setState, state) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const addLecture = async () => {
    if (!newLecture.courseId) return alert("Please select a course for the lecture!");

    await fetch(`http://localhost:5000/api/teacher/courses/${newLecture.courseId}/lectures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: newLecture.title,
        description: newLecture.description,
        video_url: newLecture.video_url,
      }),
    });

    setNewLecture({ title: "", description: "", video_url: "", courseId: "" });
    fetchLectures();
  };

  const updateLecture = async () => {
    await fetch(`http://localhost:5000/api/teacher/lectures/${editLecture.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: editLecture.title,
        description: editLecture.description,
        video_url: editLecture.video_url,
      }),
    });

    setEditLecture(null);
    fetchLectures();
  };

  const deleteLecture = async (lectureId) => {
    const confirm = window.confirm("Delete this lecture?");
    if (!confirm) return;

    await fetch(`http://localhost:5000/api/teacher/courses/${selectedCourseId}/lectures/${lectureId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchLectures();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-purple-700">🎥 Lectures</h2>

        {/* Course Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-2">
          <label className="block font-medium text-gray-700">📘 Select Course:</label>
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

        {/* Add Lecture Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-800">➕ Add New Lecture</h3>
          <input
            name="title"
            placeholder="Title"
            value={newLecture.title}
            onChange={(e) => handleChange(e, setNewLecture, newLecture)}
            className="w-full p-3 border rounded-xl"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newLecture.description}
            onChange={(e) => handleChange(e, setNewLecture, newLecture)}
            className="w-full p-3 border rounded-xl"
          />
          <input
            name="video_url"
            placeholder="Video URL"
            value={newLecture.video_url}
            onChange={(e) => handleChange(e, setNewLecture, newLecture)}
            className="w-full p-3 border rounded-xl"
          />
          <select
            name="courseId"
            value={newLecture.courseId}
            onChange={(e) => handleChange(e, setNewLecture, newLecture)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl transition"
            onClick={addLecture}
          >
            Add Lecture
          </button>
        </div>

        {/* Lectures List */}
        {Object.entries(lectures).map(([courseId, items]) => (
          <div key={courseId} className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-700">📘 Course ID: {courseId}</h4>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow flex justify-between items-start gap-4"
              >
                {editLecture?.id === item.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      name="title"
                      value={editLecture.title}
                      onChange={(e) => handleChange(e, setEditLecture, editLecture)}
                      className="w-full p-2 border rounded-xl"
                    />
                    <textarea
                      name="description"
                      value={editLecture.description}
                      onChange={(e) => handleChange(e, setEditLecture, editLecture)}
                      className="w-full p-2 border rounded-xl"
                    />
                    <input
                      name="video_url"
                      value={editLecture.video_url}
                      onChange={(e) => handleChange(e, setEditLecture, editLecture)}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-purple-700">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Watch Lecture
                    </a>
                  </div>
                )}
                <div className="space-x-2">
                  {editLecture?.id === item.id ? (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-xl"
                        onClick={updateLecture}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded-xl"
                        onClick={() => setEditLecture(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-xl"
                        onClick={() => setEditLecture(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded-xl"
                        onClick={() => deleteLecture(item.id)}
                      >
                        Delete
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
