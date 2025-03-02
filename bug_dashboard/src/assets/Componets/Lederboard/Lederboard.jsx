import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Medal, Target } from "lucide-react";

export default function Leaderboard() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeRange]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/leaderboard", {
        params: { timeRange },
      });
      
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      const formattedData = response.data.map((user, index) => ({
        id: index + 1,
        name: user._id !== null ? user._id : "Unknown", // Use _id instead of changeBy
        //name: user.changeBy || "Unknown", // Ensure no undefined values
        tasksCompleted: user.tasksCompleted || 0,
      }));
      
      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setUsers([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <Trophy className="h-16 w-16 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white ml-3">LEADERBOARD</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          {["weekly", "monthly", "quarterly"].map((range) => (
            <button
              key={range}
              className={`px-6 py-2 rounded ${
                timeRange === range ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          {loading ? (
            <p className="text-blue-400 text-center">Loading...</p>
          ) : (
            <table className="w-full text-white">
              <thead>
                <tr className="bg-gray-900 text-gray-400">
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Member</th>
                  <th className="px-6 py-3 text-center">Tasks Completed</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="px-6 py-4 flex items-center">
                      {index === 0 ? (
                        <Trophy className="h-6 w-6 text-yellow-400" />
                      ) : index < 3 ? (
                        <Medal className="h-6 w-6 text-gray-300" />
                      ) : (
                        <Target className="h-5 w-5 text-blue-400" />
                      )}
                      <span className="ml-2">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4 text-center">{user.tasksCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}



