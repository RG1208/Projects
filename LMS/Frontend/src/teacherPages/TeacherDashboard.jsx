import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Teacher";
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dashboardCards = [
    {
      title: "Manage Courses",
      description: "Add, update, and delete courses you teach.",
      onClick: () => navigate("/teacher/courses"),
      icon: "📘",
    },
    {
      title: "Manage Assignments",
      description: "Create and manage assignments for each course.",
      onClick: () => navigate("/teacher/assignments"),
      icon: "📝",
    },
    {
      title: "Manage Lectures",
      description: "Add lecture materials and notes.",
      onClick: () => navigate("/teacher/lectures"),
      icon: "🎥",
    },
    {
      title: "Student Submissions",
      description: "View and grade student submissions.",
      onClick: () => navigate("/teacher/submissions"),
      icon: "📤",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6">
      <main className="flex flex-col gap-8">
        {/* Welcome Banner */}
        <section className="bg-purple-600 text-white rounded-3xl px-8 py-6 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-sm mb-2">{currentDate}</p>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {name}!</h2>
            <p className="text-sm opacity-80">Empower your students and manage your courses seamlessly.</p>
          </div>
          <div className="hidden md:block w-40">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="teacher avatar"
              className="w-full"
            />
          </div>
        </section>

        {/* Page Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        </div>

        {/* Dashboard Tools */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className="bg-white cursor-pointer p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-start gap-4"
              >
                <div className="text-3xl">{card.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Upcoming Reviews</h3>
            <p className="text-sm text-gray-600">You have 5 assignments pending for review.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Weekly Classes</h3>
            <p className="text-sm text-gray-600">Total 12 lectures scheduled this week.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Student Performance</h3>
            <p className="text-sm text-gray-600">Average submission rate: 88%</p>
          </div>
        </section>
      </main>
    </div>
  );
}
