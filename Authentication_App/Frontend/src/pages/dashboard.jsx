import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Dashboard() {
  const { user_id } = useParams(); // ✅ gets the id from URL
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome, User #{user_id}!</p>

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Profile
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
