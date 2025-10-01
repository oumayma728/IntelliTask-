// src/Routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import TeamDashboard from "./Pages/TeamDashboard";
import PersonalDashboard from "./Pages/PersonalDashboard"
import Home from "./Pages/Home"
export default function AppRoutes() {
    const { token } = useAuth();

    return (
    <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/TeamDashboard" element={<TeamDashboard />} />
    <Route path="/PersonalDashboard" element={<PersonalDashboard />} />



    <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
);
}
