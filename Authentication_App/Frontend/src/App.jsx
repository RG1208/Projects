import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import AdminDashboard from "./pages/adminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import PrivateRoute from "./pages/protectedRoute.jsx";
import Home from "./pages/home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based private routes */}
        <Route element={<PrivateRoute allowedRole="admin" />}>
          <Route path="/dashboard/admin/:id" element={<AdminDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRole="user" />}>
          <Route path="/dashboard/user/:id" element={<UserDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
