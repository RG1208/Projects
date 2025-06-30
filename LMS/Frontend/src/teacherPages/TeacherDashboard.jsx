import React, { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <p className="text-gray-700">Logged-in User ID: <strong>{userId}</strong></p>
    </div>
  );
}
