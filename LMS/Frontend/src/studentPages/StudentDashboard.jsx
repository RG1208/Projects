import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Student";
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dashboardCards = [
    {
      title: "Courses",
      description: "Manage your enrolled courses.",
      onClick: () => navigate("/student/course-management"),
      icon: "🎓",
    },
    {
      title: "Assignments",
      description: "View and complete assignments.",
      onClick: () => navigate("/student/assignments"),
      icon: "📝",
    },
    {
      title: "Lectures",
      description: "Access lecture materials.",
      onClick: () => navigate("/student/lectures"),
      icon: "📚",
    },
    {
      title: "Submissions",
      description: "Track your submissions.",
      onClick: () => navigate("/student/submissions"),
      icon: "✅",
    },
  ];

  const notices = [
    {
      title: "Prelim Payment Due",
      detail: "Please clear your prelim fees before 20th July.",
    },
    {
      title: "Exam Schedule",
      detail: "Mid-term exams will begin from 25th July.",
    },
    {
      title: "Library Closed",
      detail: "Library will be closed on 15th July due to maintenance.",
    },
    {
      title: "Seminar Registration",
      detail: "Register by 18th July to attend the AI/ML seminar.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6">
      <main className="flex flex-col gap-8">
        {/* Welcome Banner */}
        <section className="bg-purple-600 text-white rounded-3xl px-8 py-6 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-sm mb-2">{currentDate}</p>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {name}!</h2>
            <p className="text-sm opacity-80">Always stay updated in your student portal</p>
          </div>
          <div className="hidden md:block w-40">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5231/5231019.png"
              alt="student avatar"
              className="w-full"
            />
          </div>
        </section>

        {/* Top Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Finance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg text-gray-500 mb-1">Total Payable</h3>
            <p className="text-2xl font-bold text-purple-700">$10,000</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-2xl shadow text-center border-2 border-purple-400">
            <h3 className="text-lg text-gray-500 mb-1">Total Paid</h3>
            <p className="text-2xl font-bold text-purple-700">$5,000</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg text-gray-500 mb-1">Others</h3>
            <p className="text-2xl font-bold text-purple-700">$300</p>
          </div>
        </section>

        {/* Daily Notices - Horizontal */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Daily Notice</h2>
            <button className="text-purple-600 text-sm hover:underline">See all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {notices.map((notice, index) => (
              <div
                key={index}
                className="min-w-[250px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition shrink-0"
              >
                <h3 className="font-semibold text-purple-700 mb-1 text-sm">
                  {notice.title}
                </h3>
                <p className="text-xs text-gray-600">{notice.detail}</p>
                <button className="text-purple-500 text-xs mt-2 hover:underline">
                  See more
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Tools */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className="bg-white cursor-pointer p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-start gap-4"
              >
                <div className="text-3xl">{card.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Extra Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Academic Progress</h3>
            <p className="text-sm text-gray-600">You have completed 68% of your current semester.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Upcoming Exams</h3>
            <p className="text-sm text-gray-600">OOPs & DBMS exams on 25th and 28th July.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Today's Schedule</h3>
            <p className="text-sm text-gray-600">10:00 AM - OOPs Lab<br/>2:00 PM - DBMS Lecture</p>
          </div>
        </section>
      </main>
    </div>
  );
}
