import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import PrivateRoute from "./components/protectedRoutes";
import Home from "./pages/home";
import TeacherSidebar from "./teacherPages/teacherLayoutSidebar";

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
            <Route path="/dashboard/teacher/:id" element={<TeacherSidebar />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="lectures" element={<Lectures />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

