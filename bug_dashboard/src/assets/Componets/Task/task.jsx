import React from 'react';
import { Clock, ExternalLink, Star } from 'lucide-react';
import { useParams } from "react-router-dom";

const Task = () => {
    const { taskId } = useParams();
  // Helper function to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header Section */}
      <div className="bg-purple-600 -mx-6 -mt-6 p-6 rounded-t-lg text-white mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm mb-2">Task ID: TASK-123</div>
            <h1 className="text-2xl font-bold">E-commerce Platform Redesign</h1>
          </div>
          <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm">
            In Progress
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-gray-600 mb-1">Industry</h3>
          <p className="text-blue-600 hover:underline cursor-pointer">
            Retail & E-commerce
          </p>
        </div>
        <div>
          <h3 className="text-gray-600 mb-1">Batch</h3>
          <p>Batch 2024-Q1</p>
        </div>
        <div>
          <h3 className="text-gray-600 mb-1">Tool Link</h3>
          <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
            Open Tool
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div>
          <h3 className="text-gray-600 mb-1">Difficulty</h3>
          <p>Medium</p>
        </div>
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Claimed: 15/3/2024, 4:00:00 pm</span>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Review</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Review</span>
            <div className="flex">{renderStars(4)}</div>
          </div>
          <p className="mb-3">
            Excellent work on the user interface. The attention to detail is impressive.
          </p>
          <p className="text-sm text-gray-600">
            Reviewed by Sarah Johnson on 14/3/2024, 9:15:00 pm
          </p>
        </div>
      </div>

      {/* Previous Attempts Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Previous Attempts</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                In Progress
              </span>
              <span className="text-sm text-gray-600">13/3/2024, 2:30:00 pm</span>
            </div>
            <p>Initial implementation of the checkout flow</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm">
                Review
              </span>
              <span className="text-sm text-gray-600">14/3/2024, 4:50:00 pm</span>
            </div>
            <p>Updated based on first round of feedback</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="border rounded-lg px-4 py-2">
            <option>In Progress</option>
            <option>Review</option>
            <option>Completed</option>
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            Add Feedback
          </button>
        </div>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Submit to Client
        </button>
      </div>
    </div>
  );
};

export default Task;