import { useLocation , Outlet, Link} from "react-router-dom";
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Student Dashboard
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
