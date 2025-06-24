import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import PrivateRoute from "./pages/protectedRoute.jsx";
import Home from "./pages/home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/:user_id" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
