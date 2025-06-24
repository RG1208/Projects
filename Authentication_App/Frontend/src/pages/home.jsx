import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-4xl font-bold mb-4">Authentication App</h1>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => navigate("/login")}
      >
        Login
      </button>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => navigate("/register")}
      >
        Register
      </button>
    </div>
  );
}
