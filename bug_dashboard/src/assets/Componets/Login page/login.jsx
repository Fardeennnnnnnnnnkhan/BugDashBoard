import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegMoon, FaSun } from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from "../Admin Dashboard/config";

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let response;
      if (role === "admin") {
        response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      } else {
        response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password, role });
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", role);
      setUserRole(role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        setMessage("Your registration is pending approval.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold dark:text-white">Astraeus</h2>
          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaRegMoon />}
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center dark:text-white">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Enter your credentials</p>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium dark:text-white">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-700 dark:text-white">
            <option value="admin">Admin</option>
            <option value="coach">Coach</option>
            <option value="hunter">Hunter</option>
          </select>
          <label className="block mb-2 font-medium dark:text-white">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-700 dark:text-white" placeholder="name@example.com" required />
          <label className="block mb-2 font-medium dark:text-white">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-700 dark:text-white" placeholder="••••••••" required />
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
