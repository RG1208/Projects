import React, { useEffect, useState } from "react";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [editCourse, setEditCourse] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = () => {
    fetch("http://localhost:5000/api/teacher/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setFilteredCourses(data.courses);
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
  };

  const addCourse = async () => {
    const res = await fetch("http://localhost:5000/api/teacher/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourse),
    });

    if (res.ok) {
      setNewCourse({ title: "", description: "" });
      fetchCourses();
    }
  };

  const updateCourse = async () => {
    const res = await fetch(`http://localhost:5000/api/teacher/courses/${editCourse.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editCourse),
    });

    if (res.ok) {
      setEditCourse(null);
      fetchCourses();
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch(`http://localhost:5000/api/teacher/courses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchCourses();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 space-y-10">
      <h2 className="text-3xl font-bold text-red-600">Courses</h2>

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by title..."
        className="w-full px-4 py-2 border rounded-lg shadow-sm"
      />

      {/* Add New Course Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Add New Course</h3>
        <input
          name="title"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newCourse.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={addCourse}
        >
          Add Course
        </button>
      </div>

      {/* List of Courses */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-red-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600">Title</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600">Description</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredCourses.map((course) =>
              editCourse && editCourse.id === course.id ? (
                <tr key={course.id} className="bg-yellow-50">
                  <td className="px-6 py-4">{course.id}</td>
                  <td className="px-6 py-4">
                    <input
                      name="title"
                      value={editCourse.title}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      name="description"
                      value={editCourse.description}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={updateCourse}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditCourse(null)}
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={course.id}>
                  <td className="px-6 py-4">{course.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{course.title}</td>
                  <td className="px-6 py-4 text-gray-600">{course.description}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setEditCourse(course)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
