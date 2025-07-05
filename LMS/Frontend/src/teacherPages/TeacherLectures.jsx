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
        Authorization: `Bearer ${token}`,
      },
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
        Authorization: `Bearer ${token}`,
      },
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
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-blue-600">Lectures</h2>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <label className="block font-medium">Select Course:</label>
        <select
          className="w-full p-2 border rounded"
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

      <div className="bg-white p-4 rounded-lg shadow space-y-2">
        <h3 className="text-lg font-semibold">Add New Lecture</h3>
        <input
          name="title"
          value={newLecture.title}
          onChange={(e) => handleChange(e, setNewLecture, newLecture)}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={newLecture.description}
          onChange={(e) => handleChange(e, setNewLecture, newLecture)}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="video_url"
          value={newLecture.video_url}
          onChange={(e) => handleChange(e, setNewLecture, newLecture)}
          placeholder="Video URL"
          className="w-full p-2 border rounded"
        />
        <select
          name="courseId"
          value={newLecture.courseId}
          onChange={(e) => handleChange(e, setNewLecture, newLecture)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={addLecture}
        >
          Add Lecture
        </button>
      </div>

      {Object.entries(lectures).map(([courseId, items]) => (
        <div key={courseId} className="space-y-4">
          <h4 className="text-lg font-bold text-gray-700">Course ID: {courseId}</h4>
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              {editLecture?.id === item.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    name="title"
                    value={editLecture.title}
                    onChange={(e) => handleChange(e, setEditLecture, editLecture)}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    value={editLecture.description}
                    onChange={(e) => handleChange(e, setEditLecture, editLecture)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    name="video_url"
                    value={editLecture.video_url}
                    onChange={(e) => handleChange(e, setEditLecture, editLecture)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-blue-500 underline">{item.video_url}</p>
                </div>
              )}
              <div className="space-x-2">
                {editLecture?.id === item.id ? (
                  <>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={updateLecture}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                      onClick={() => setEditLecture(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => setEditLecture(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
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
  );
}
