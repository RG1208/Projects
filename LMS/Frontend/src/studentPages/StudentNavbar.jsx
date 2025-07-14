import { useNavigate } from "react-router-dom";
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
    <header className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50 rounded-b-2xl">
      {/* Left: Search bar */}
      <div className="flex items-center gap-3 w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Right: Notification + Profile + Logout */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative text-gray-600 hover:text-black transition">
          <Bell size={22} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40?img=15"
            alt="avatar"
            className="rounded-full w-8 h-8 border"
          />
          <div className="text-sm text-gray-700">3rd Year</div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </header>
  );
}
