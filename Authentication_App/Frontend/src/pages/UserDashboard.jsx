import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          User Dashboard
        </h1>
        <p className="text-gray-700 mb-4">
          Welcome, User #{id}! This is your personal dashboard.
        </p>
        <div className="space-x-4 mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Profile
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Reports
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
