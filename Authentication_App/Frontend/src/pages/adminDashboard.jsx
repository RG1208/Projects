import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-800 mb-4">
          Hello, Admin #{id}. You have full access to system controls and
          analytics.
        </p>
        <div className="space-x-4 mt-6">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Manage Users
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            View Analytics
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            System Logs
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
