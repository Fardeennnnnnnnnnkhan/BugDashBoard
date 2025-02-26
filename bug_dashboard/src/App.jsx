import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/Componets/Login page/login";
import Signin from "./assets/Componets/Login page/signin";
import Admin from "./assets/Componets/Admin Dashboard/Admin";
import Hunter from "./assets/Componets/Hunter Dashboard/hunter";
import Coach from "./assets/Componets/Coach Dashboard/coach";
import Tool from './assets/Componets/Tool/tool';
import TaskDetails from "./assets/Componets/Task/task";
import Task from './assets/Componets/Task/task';
import Leaderboard from './assets/Componets/Lederboard/lederboard';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signin" element={<Signin setUserRole={setUserRole} />} />
        <Route path="/hunter" element={<Hunter/>} />
        <Route path="/coach" element={<Coach/>} />
        {/* ✅ Ensure Only Admins Can Access the Admin Page */}
        <Route path="/admin" element={userRole === "admin" ? <Admin /> : <Navigate to="/login" replace />} />
        {/* <Route path="/admin" element={userRole === "admin" ? <Admin /> : <Navigate to="/login" replace />} /> */}
        <Route path="/tool" element={<Tool/>} />
        <Route path="/task" element={<Task/>} />
        
        <Route path="/task-details/:taskId" element={<TaskDetails />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        
        
        
        
      </Routes>
    </Router>
  );
}

export default App;
