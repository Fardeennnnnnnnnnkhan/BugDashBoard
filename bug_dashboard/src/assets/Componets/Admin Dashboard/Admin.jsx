import React, { useState, useEffect } from "react";
import { Moon, Sun, Search, Edit, Eye, LogOut, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../Admin Dashboard/config";
 

export default function Admin() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/pending-users`);
      console.log("Fetched Users:", response.data); 
      setPendingUsers(Array.isArray(response.data) ? response.data : []);
  
      console.log("Updated State:", pendingUsers); 
    } catch (error) {
      console.error("Error fetching pending users", error);
      setPendingUsers([]); 
    }
  };
  

  const approveUser = async (pendingUserId) => {
    try {
        await axios.post(`${API_BASE_URL}/auth/approve-user`, { pendingUserId });
        setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== pendingUserId));
        console.log("User approved successfully!");
    } catch (error) {
        console.error("Error approving user:", error.response?.data || error.message);
    }
};


  const rejectUser = async (userId) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reject-user`, { userId });
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error rejecting user", error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Management Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={() => { localStorage.removeItem("userRole"); navigate("/login"); }} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pending User Approvals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No pending users</td>
                  </tr>
                ) : (
                  pendingUsers.map((user) => (
                    <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4 text-sm">{user.username}</td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{user.role}</td>
                      <td className="px-6 py-4 text-sm flex space-x-2">
                        <button onClick={() => approveUser(user._id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
                          <Check className="h-4 w-4 inline-block" /> Approve
                        </button>
                        <button onClick={() => rejectUser(user._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">
                          <X className="h-4 w-4 inline-block" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
