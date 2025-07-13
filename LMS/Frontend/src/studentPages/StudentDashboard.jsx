import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name')
  const dashboardCards = [
    {
      title: "Courses",
      description: "Add, update, and delete courses you teach.",
      onClick: () => navigate("/student/course-management"),
      color: "bg-blue-600",
    },
    {
      title: "Assignments",
      description: "Create and manage assignments for each course.",
      onClick: () => navigate("/student/assignments"),
      color: "bg-green-600",
    },
    {
      title: "Lectures",
      description: "Add lecture materials and notes.",
      onClick: () => navigate("/student/lectures"),
      color: "bg-red-600",
    },
    {
      title: "Submissions",
      description: "View and grade student submissions.",
      onClick: () => navigate("/student/submissions"),
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Student Dashboard</h1>
      <h2>Welcome {name} </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className={`cursor-pointer p-6 rounded-2xl shadow-md text-white ${card.color} hover:shadow-xl transition duration-300`}
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
