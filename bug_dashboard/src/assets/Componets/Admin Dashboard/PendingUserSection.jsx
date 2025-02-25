
// export default function PendingUserSection(){
//     return (
// <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pending User Approvals</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//               <thead className="bg-gray-50 dark:bg-gray-800">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Username</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white dark:bg-gray-800">
//                 {pendingUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">No pending users</td>
//                   </tr>
//                 ) : (
//                   pendingUsers.map((user) => (
//                     <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
//                       <td className="px-6 py-4 text-sm">{user.username}</td>
//                       <td className="px-6 py-4 text-sm">{user.email}</td>
//                       <td className="px-6 py-4 text-sm">{user.role}</td>
//                       <td className="px-6 py-4 text-sm flex space-x-2">
//                         <button onClick={() => approveUser(user._id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
//                           <Check className="h-4 w-4 inline-block" /> Approve
//                         </button>
//                         <button onClick={() => rejectUser(user._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">
//                           <X className="h-4 w-4 inline-block" /> Reject
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//     );
// }