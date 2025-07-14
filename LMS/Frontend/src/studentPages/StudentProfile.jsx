import React, { useEffect, useState } from "react";
import { Pencil, Save, X } from "lucide-react";

export const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      })
      .catch((error) => console.error("Error fetching profile:", error));

    fetch("http://127.0.0.1:5000/api/student/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalStudents: data.total_courses_enrolled,
          totalCourses: data.total_assignments,
        });
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/student/profile", {
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

  if (!profile) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Left Panel - Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Profile</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            {/* Editable Fields */}
            {editMode && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Stats */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Stats Overview</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-5 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-700">{stats.totalStudents}</div>
                <div className="text-sm text-gray-600 mt-1">Courses Enrolled</div>
              </div>
              <div className="bg-green-50 p-5 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-bold text-green-700">{stats.totalCourses}</div>
                <div className="text-sm text-gray-600 mt-1">Total Assignments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6">
          {!editMode ? (
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setEditMode(true)}
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                onClick={handleUpdate}
              >
                <Save size={18} />
                Save
              </button>
              <button
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={() => {
                  setEditMode(false);
                  setFormData({ name: profile.name, email: profile.email, password: "" });
                }}
              >
                <X size={18} />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
