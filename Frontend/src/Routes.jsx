// src/Routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import TeamDashboard from "./Pages/TeamDashboard";
import PersonalDashboard from "./Pages/PersonalDashboard"
import Home from "./Pages/Home"
import Task from "./Pages/Task"
import Calendar from "./Pages/Calendar"
import Settings from "./Pages/Settings"
import Projects from "./Components/Project";
import KanbanBoard from "./Pages/Kanban";
export default function AppRoutes() {

    return (
    <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/projects" element={Projects} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/TeamDashboard" element={<TeamDashboard />} />
    <Route path="/PersonalDashboard" element={<PersonalDashboard />} />
    <Route path="/Task" element={<Task/>}/>
        <Route path="/KanbanBoard" element={<KanbanBoard/>}/>

        <Route path="/Calendar" element={<Calendar/>}/>
        <Route path="/Settings" element={<Settings/>}/>

        
<Route path="*" element={<Navigate to="/Home" />} />
    </Routes>
);
}
