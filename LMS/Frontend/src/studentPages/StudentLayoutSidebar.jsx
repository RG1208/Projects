import { useLocation, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MapPinned,
  AlertCircle,
  Users,
  Settings,
} from "lucide-react";
import StudentNavbar from "./StudentNavbar";

const navItems = [
  {
    name: "Dashboard",
    path: "/student",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Course Management",
    path: "/student/course-management",
    icon: <MapPinned size={20} />,
  },
  {
    name: "Assignments",
    path: "/student/assignments",
    icon: <AlertCircle size={20} />,
  },
  {
    name: "Lectures",
    path: "/student/lectures",
    icon: <Users size={20} />,
  },
  {
    name: "Profile",
    path: "/student/profile",
    icon: <Settings size={20} />,
  },
];

export default function StudentSidebar() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-white">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-600 text-white rounded-3xl m-4 p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10 text-white tracking-wide">
            🎓 Student Panel
          </h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-white text-purple-700 shadow-md"
                    : "text-white hover:bg-purple-500"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-center text-sm mt-8 text-purple-100">
          © 2025 LMS Portal
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        <StudentNavbar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 rounded-3xl m-4 shadow-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
