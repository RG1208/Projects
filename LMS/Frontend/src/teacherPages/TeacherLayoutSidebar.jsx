import { useLocation , Outlet, Link} from "react-router-dom";
import {
  LayoutDashboard,
  MapPinned,
  AlertCircle,
  Users,
  Settings,
} from "lucide-react";
import StudentNavbar from "../studentPages/StudentNavbar";

const navItems = [
  {
    name: "Dashboard",
    path: "/teacher",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Course Management",
    path: "/teacher/courses",
    icon: <MapPinned size={20} />,
  },
  {
    name: "Assignments",
    path: "/teacher/assignments",
    icon: <AlertCircle size={20} />,
  },
  {
    name: "Lectures",
    path: "/teacher/lectures",
    icon: <Users size={20} />,
  },
  {
    name: "Profile",
    path: "/teacher/profile",
    icon: <Settings size={20} />,
  },
];

export default function TeacherSidebar() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Teacher Dashboard
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-red-500 text-white"
                    : "text-gray-700 hover:bg-red-100"
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        <StudentNavbar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
