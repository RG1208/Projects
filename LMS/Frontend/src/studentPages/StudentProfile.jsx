import React, { useEffect, useState } from "react";

export const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch profile
    fetch("http://127.0.0.1:5000/api/student/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Backend returns user data directly, not wrapped in 'student' object
        setProfile(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });

    fetch("http://127.0.0.1:5000/api/student/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats({ 
          totalStudents: data.total_courses_enrolled, 
          totalCourses: data.total_assignments 
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
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

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-red-600">Student Profile</h2>

        <div className="space-y-2">
          <div><span className="font-semibold">ID:</span> {profile.id}</div>
          {!editMode ? (
            <>
              <div><span className="font-semibold">Name:</span> {profile.name}</div>
              <div><span className="font-semibold">Email:</span> {profile.email}</div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">New Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </>
          )}
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center shadow-sm">
              <div className="text-lg font-bold">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Courses Enrolled</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center shadow-sm">
              <div className="text-lg font-bold">{stats.totalCourses}</div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {!editMode ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
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
};
