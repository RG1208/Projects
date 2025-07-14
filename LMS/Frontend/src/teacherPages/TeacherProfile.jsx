import React, { useEffect, useState } from "react";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/teacher/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.teacher) {
          setProfile(data.teacher);
          setFormData({ name: data.teacher.name, email: data.teacher.email, password: "" });
        }
      });

    fetch("http://localhost:5000/api/teacher/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats({ totalStudents: data.total_students, totalCourses: data.total_courses });
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const res = await fetch("http://localhost:5000/api/teacher/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile updated");
      setProfile((prev) => ({ ...prev, name: formData.name, email: formData.email }));
      setEditMode(false);
    } else {
      alert(data.message || "Update failed");
    }
  };

  if (!profile) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8">
        <h2 className="text-3xl font-bold text-purple-700">👨‍🏫 Teacher Profile</h2>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="text-sm text-gray-600"><span className="font-semibold">ID:</span> {profile.id}</div>

          {!editMode ? (
            <>
              <div className="text-lg"><span className="font-semibold">Name:</span> {profile.name}</div>
              <div className="text-lg"><span className="font-semibold">Email:</span> {profile.email}</div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-purple-300 focus:ring-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-purple-300 focus:ring-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-purple-300 focus:ring-2 outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">📊 Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-5 rounded-xl text-center shadow">
              <div className="text-2xl font-bold text-purple-700">{stats.totalCourses}</div>
              <div className="text-sm text-gray-600">Courses Posted</div>
            </div>
            <div className="bg-green-50 p-5 rounded-xl text-center shadow">
              <div className="text-2xl font-bold text-green-700">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Students Enrolled</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          {!editMode ? (
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl transition"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-xl transition"
                onClick={() => {
                  setEditMode(false);
                  setFormData({ name: profile.name, email: profile.email, password: "" });
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
