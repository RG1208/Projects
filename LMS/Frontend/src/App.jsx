import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import PrivateRoute from "./components/protectedRoutes";
import Home from "./pages/home";
import TeacherSidebar from "./teacherPages/TeacherLayoutSidebar";
import TeacherProfile from "./teacherPages/TeacherProfile";
import TeacherLectures from "./teacherPages/TeacherLectures";
import TeacherAssignments from "./teacherPages/TeacherAssignments";
import TeacherCourses from "./teacherPages/TeacherCourses";
import TeacherDashboard from "./teacherPages/TeacherDashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-based private routes */}
          <Route element={<PrivateRoute allowedRole="teacher" />}>
            <Route path="/teacher" element={<TeacherSidebar />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="courses" element={<TeacherCourses />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="lectures" element={<TeacherLectures />} />
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

