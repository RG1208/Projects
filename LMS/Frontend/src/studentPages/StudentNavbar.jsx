import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";

export default function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-end items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-red-600 transition">
          <Bell size={22} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </header>
  );
}
