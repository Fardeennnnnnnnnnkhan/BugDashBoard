import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Eye, Send } from 'lucide-react';
import { ReviewModal } from './ReviewModal';
import { useParams } from 'react-router-dom';

export function CoachView({ userRole="coach", onUpdateTaskStatus, onSubmitReview, onSubmitFinalReview }) {
    const [feedback, setFeedback] = useState("");
  const [tasks, setTasks] = useState([]);
    // const [selectedReview, setSelectedReview] = useState(null);
//   const [selectedFinalReport, setSelectedFinalReport] = useState(null);
    // const tasks = [
    //     {
    //       id: 'BH-001',
    //       toolLink: 'https://example.com/target-app',
    //       status: 'completed',
    //       reviews: [
    //         {
    //           id: 1,
    //           script: 'Basic XSS Test',
    //           scriptFile: null,
    //           behavior: 'Application properly escapes user input',
    //           vulnerabilities: 'No XSS vulnerabilities found',
    //           files: [],
    //         },
    //         {
    //           id: 2,
    //           script: 'SQL Injection Test',
    //           scriptFile: null,
    //           behavior: 'Input validation prevents SQL injection',
    //           vulnerabilities: 'No SQL injection vulnerabilities found',
    //           files: [],
    //         }
    //       ],
    //       finalReport: {
    //         summary: 'The application shows good security practices overall.',
    //         difficulty: 'medium',
    //       },
    //     },
    //   ]
  

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/task/statusFetch?status=complete");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchCompletedTasks();
  }, []);

  const completedTasks = tasks.filter(task => 
    userRole === 'admin' ? task.status === 'validated' : task.status === 'completed'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Task Reviews</h2>
      
      <div className="space-y-6">
        {completedTasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Task ID: {task.id}</h3>
              <div className="flex items-center space-x-2">
                {userRole === 'admin' ? (
                  <button
                    // onClick={() => onUpdateTaskStatus(task.id, 'approved')}
                    className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                  >
                    <Send className="w-4 h-4 mr-1" /> Approve for Delivery
                  </button>
                ) : (
                  <>
                    <button
                    //   onClick={() => onUpdateTaskStatus(task.id, 'validated')}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Validate
                    </button>
                    <button
                    //   onClick={() => onUpdateTaskStatus(task.id, 'returned')}
                      className="flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> Return
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {task.reviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div>
                    <p className="font-medium">{review.script}</p>
                    {review.reviewerFeedback && (
                      <p className="text-sm text-gray-600 mt-1">Previous feedback: {review.reviewerFeedback}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedReview({ taskId: task.id, review })}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Review
                  </button>
                </div>
              ))}

              {task.finalReport && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Final Report</p>
                      <p className="text-sm text-gray-600 mt-1">Difficulty: {task.finalReport.difficulty}</p>
                      {task.finalReport.reviewerFeedback && (
                        <p className="text-sm text-gray-600 mt-1">Previous feedback: {task.finalReport.reviewerFeedback}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedFinalReport({ taskId: task.id, report: task.finalReport })}
                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedReview && (
        <ReviewModal
          isOpen={true}
          onClose={() => setSelectedReview(null)}
          review={selectedReview.review}
          onSubmitReview={(feedback) => {
            // onSubmitReview(selectedReview.taskId, selectedReview.review.id, feedback);
            setSelectedReview(null);
          }}
        />
      )}

      {selectedFinalReport && (
        <ReviewModal
          isOpen={true}
          onClose={() => setSelectedFinalReport(null)}
          review={{
            script: 'Final Report',
            behavior: selectedFinalReport.report.summary,
            vulnerabilities: `Difficulty: ${selectedFinalReport.report.difficulty}`,
          }}
          onSubmitReview={(feedback) => {
            // onSubmitFinalReview(selectedFinalReport.taskId, feedback);
            setSelectedFinalReport(null);
          }
        }
        />
      )}
    </div>
  );
}
