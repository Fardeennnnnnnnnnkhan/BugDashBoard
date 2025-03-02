import React, { useState, useEffect } from "react";
import { Trophy, Search, Medal, Zap, Target, BookOpen } from "lucide-react";

export default function Leaderboard() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [taskTheme, setTaskTheme] = useState("Coding Challenge");
  
  useEffect(() => {
    setLoading(true);
    setShowAnimation(false);
    
    setTimeout(() => {
      const sampleData = [
        { id: 1, name: "Swapnil", tasksCompleted: 39, currentTask: "Database Setup and backend", performance: 100, reputation: 10000 },
        { id: 2, name: "Mrinal", tasksCompleted: 47, currentTask: "API Integration", performance: 98, reputation: 4875 },
        { id: 3, name: "Aniket", tasksCompleted: 42, currentTask: "UI Design", performance: 95, reputation: 4210 },
        { id: 4, name: "Shruti", tasksCompleted: 36, currentTask: "Testing", performance: 92, reputation: 3650 },
        { id: 5, name: "Janvi", tasksCompleted: 33, currentTask: "Documentation", performance: 90, reputation: 3320 },
        { id: 6, name: "Rohit Sharma", tasksCompleted: 31, currentTask: "Bug Fixing", performance: 88, reputation: 3100 },
        { id: 7, name: "Virat Kohli", tasksCompleted: 29, currentTask: "Code Review", performance: 87, reputation: 2780 },
      ];
      setUsers(sampleData);
      setLoading(false);
      setTimeout(() => setShowAnimation(true), 100);
    }, 1000);
  }, [timeRange]);

  const getBadgeIcon = (position) => {
    switch (position) {
      case 0: return (
        <div className="relative group animate-float">
          <Trophy className="h-6 w-6 text-yellow-400 transform group-hover:scale-125 transition-transform duration-300 animate-glow" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      );
      case 1: return (
        <div className="group animate-float">
          <Medal className="h-6 w-6 text-slate-300 transform group-hover:scale-125 transition-transform duration-300" />
        </div>
      );
      case 2: return (
        <div className="group animate-float">
          <Medal className="h-6 w-6 text-amber-600 transform group-hover:scale-125 transition-transform duration-300" />
        </div>
      );
      default: return (
        <div className="group">
          <Target className="h-5 w-5 text-blue-400 opacity-50 transform group-hover:scale-110 transition-transform" />
        </div>
      );
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="mb-10 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-center mb-6 relative animate-float">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <Trophy className="h-16 w-16 text-yellow-400 mr-4 animate-glow" />
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-2 animate-gradient neon-text">
                LEADERBOARD
              </h1>
              <p className="text-gray-400 hover:text-gray-300 transition-colors text-lg shine-effect">
                Rise to Glory
              </p>
            </div>
          </div>
          
          {/* Task Theme Display */}
          <div className="flex justify-center items-center mt-4">
            <div className="bg-gray-800/70 px-6 py-3 rounded-full border border-blue-500/30 backdrop-blur-sm group hover:bg-gray-700/70 transition-all duration-300 animate-pulse">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">Current Theme:</span>
                <span className="text-white font-bold">{taskTheme}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search champions..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border-2 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-500/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 bg-gray-800/50 rounded-lg p-1 border-2 border-gray-700 backdrop-blur-sm">
            {['weekly', 'monthly', 'quarterly'].map((range) => (
              <button 
                key={range}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 shine-effect' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className={`bg-gray-800/50 rounded-xl shadow-2xl border-2 border-gray-700 overflow-hidden backdrop-blur-sm transition-all duration-1000 transform ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-blue-400 animate-pulse">Loading Champions...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 border-b-2 border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Member</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Tasks</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Current Task</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Task Power</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-gray-700/50 transition-all duration-300 cursor-pointer
                      ${highlightedRow === user.id ? 'bg-blue-600/20' : index < 3 ? 'bg-blue-900/20' : ''}
                      hover:bg-blue-600/20`}
                    onMouseEnter={() => setHighlightedRow(user.id)}
                    onMouseLeave={() => setHighlightedRow(null)}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                      opacity: showAnimation ? 1 : 0
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getBadgeIcon(index)}
                        <span className="ml-2 font-semibold text-gray-300">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center group">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-300 shine-effect">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{user.name}</div>
                          <div className="text-sm text-gray-500">Level {Math.floor(user.reputation / 100)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1 group">
                        <Zap className="h-5 w-5 text-blue-400 group-hover:text-yellow-400 transition-colors transform group-hover:scale-125 duration-300" />
                        <span className="font-semibold text-gray-300 group-hover:text-yellow-400 transition-colors">
                          {user.tasksCompleted}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300 font-medium hover:bg-blue-500/30 transition-colors">
                        {user.currentTask}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center group">
                        <div className="w-full max-w-[120px] h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 shine-effect ${
                              user.performance >= 95 ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500' :
                              user.performance >= 90 ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500' :
                              'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500'
                            } animate-pulse`}
                            style={{ width: `${user.performance}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                          {user.performance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-lg transition-all duration-300 ${
                        index === 0 ? 'text-yellow-400 group-hover:text-yellow-300 animate-glow' :
                        index === 1 ? 'text-slate-300 group-hover:text-white' :
                        index === 2 ? 'text-amber-600 group-hover:text-amber-500' :
                        'text-gray-300 group-hover:text-blue-400'
                      }`}>
                        {user.reputation.toLocaleString()}
                      </span>
                    </td>
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