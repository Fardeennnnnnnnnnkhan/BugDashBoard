

import React, { useState, useEffect } from "react";
import { ChevronDown, Upload, Plus } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SecurityTestingDashboard = () => {
  // State for new script form (mapping: newScript.name → script_name)
  const [newScript, setNewScript] = useState({
    name: "",
    category: "",
    code: "",
  });

  // State for fetched scripts dropdown
  const [dbScripts, setDbScripts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Other states (for review, report, etc.)
  const [scriptName, setScriptName] = useState("");
  const [category, setCategory] = useState("");
  const [scriptCode, setScriptCode] = useState("");
  const [reportSummary, setReportSummary] = useState("");
  const [difficultyRating, setDifficultyRating] = useState("Medium");
  const [isTestingScriptsOpen, setIsTestingScriptsOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [observedBehavior, setObservedBehavior] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState("");
  const [file, setFile] = useState(null);
  const [supportingFiles, setSupportingFiles] = useState(null);
  const [reviewList, setReviewList] = useState([]);

  const { taskId } = useParams();
  const navigate = useNavigate();

  // Role selection state
  const [selectedRole, setSelectedRole] = useState("hunter");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roles = [
    { id: "hunter", label: "View as Hunter" },
    { id: "coach", label: "View as Coach" },
    { id: "admin", label: "View as Admin" },
  ];

  // Fetch scripts from backend for dropdown
  const fetchScripts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/scripts");
      console.log("Fetched scripts:", response.data);
      setDbScripts(response.data);
    } catch (error) {
      console.error("Error fetching scripts:", error);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);


  // const ResourceViewer = () => {
  //   const [resources, setResources] = useState([]);

  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [texts, videos] = await Promise.all([
          fetch("http://localhost:3000/api/texts").then((res) => res.json()).catch(() => []),
          fetch("http://localhost:3000/api/videos").then((res) => res.json()).catch(() => []),
        ]);

        console.log("Fetched Texts:", texts);
        console.log("Fetched Videos:", videos);
        setResources([...texts, ...videos]);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };

    fetchResources();
  }, []);

    //   return (
    //     <div className="p-6 max-w-4xl mx-auto">
    //       <h1 className="text-2xl font-bold mb-4">📚 Documentation & Tutorials</h1>
    //       {resources.length === 0 ? (
    //         <p className="text-gray-500">Loading resources...</p>
    //       ) : (
    //         <div className="grid gap-4">
    //           {resources.map((resource) => (
    //             <div key={resource._id} className="p-4 shadow-md border rounded-lg bg-white">
    //               <a
    //                 href={resource.content}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="text-lg font-semibold text-blue-600 hover:underline"
    //               >
    //                 {resource.title}
    //               </a>
    //               <p className="text-sm text-gray-600">{resource.description}</p>
    //             </div>
    //           ))}
    //         </div>
    //       )}
    //     </div>
    //   );
    // };

    // Filter the fetched scripts based on search term
    const filteredScripts = dbScripts.filter((script) => {
      const cat = script.category || "";
      const act = script.activity || "";
      return (
        cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Handle input changes for the new script form
    const handleNewScriptInputChange = (e) => {
      setNewScript({ ...newScript, [e.target.name]: e.target.value });
    };

    // Handle new script submission – note the keys we send!
    const handleAddNewScript = async () => {
      console.log("New script data:", newScript);
      if (!newScript.name || !newScript.category || !newScript.code) {
        alert("Please fill in all fields!");
        return;
      }
      // Send keys that your backend expects
      const scriptData = {
        script_name: newScript.name, // maps to activity in the backend
        category: newScript.category,
        script_code: newScript.code, // maps to tools_technique in the backend
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/api/scripts/create",
          scriptData,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("New script added:", response.data);
        alert("Script added successfully!");
        setNewScript({ name: "", category: "", code: "" });
        fetchScripts();
      } catch (error) {
        console.error("Error adding script:", error.response?.data || error.message);
        alert("Failed to add script. Check the console for details.");
      }
    };

    // Handle file upload (for review submission)
    const handleFileUpload = (event) => {
      const selectedFile = event.target.files[0];
      console.log("File selected:", selectedFile);
      if (event.target.id === "file-upload") {
        setFile(selectedFile);
        alert("File added successfully");
      } else {
        setSupportingFiles(selectedFile);
        alert("Supporting file added successfully");
      }
    };

    // Handle review submission
    const handleSubmitReview = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (!file) {
        alert("Please select a file");
        return;
      }
      if (!supportingFiles) {
        alert("Please select supporting files");
        return;
      }
      formData.append("scriptFile", file);
      formData.append("observedBehavior", observedBehavior);
      formData.append("vulnerabilities", vulnerabilities);
      formData.append("taskId", taskId);
      formData.append("supportFile", supportingFiles);
      formData.append("reviewBy", localStorage.getItem("userName"));
      try {
        const response = await axios.post(
          "http://localhost:3000/api/taskReview/create",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Review submission response:", response.data);
        alert("Review submitted successfully!");
        setReviewList([...reviewList, response.data.taskReview]);
        setObservedBehavior("");
        setVulnerabilities("");
        setFile(null);
        setSupportingFiles(null);
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review.");
      }
    };

    // Handle final report submission
    const handleFinalReportSubmit = async (e) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/finalReport/createOrUpdate",
          {
            taskId: taskId,
            reportSummary: reportSummary,
            difficulty: difficultyRating,
            updatedBy: localStorage.getItem("userName"),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Final report submitted successfully!");
        setReportSummary("");
      } catch (error) {
        alert("Failed to submit final report");
      }
    };



    // Handle role change
    const handleRoleChange = (role) => {
      setSelectedRole(role);
      setIsRoleDropdownOpen(false);
      if (role === "coach") navigate("/coachview");
      if (role === "admin") navigate("/adminview");
    };
    return (
      <div className="max-w-6xl mx-auto p-4">
        {/* Top Section: Task ID, Target URL, and Role Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Task ID: BH-001</h1>
            <a
              href="https://example.com/target-app"
              className="text-blue-500 hover:underline text-sm"
            >
              https://example.com/target-app
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-500">In Progress</span>
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              >
                {roles.find((role) => role.id === selectedRole)?.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setIsRoleDropdownOpen(false);
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Help & Resources with New Script Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Help & Resources</h2>
              <div className="space-y-4">
                {/* Testing Scripts Dropdown */}
                <div className="border rounded-lg">
                  <button
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>Standard Testing Scripts</span>
                    <ChevronDown
                      className={`h-4 w-4 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="border-t p-3">
                      {/* Search Bar for Dropdown */}
                      <input
                        type="text"
                        placeholder="Search scripts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded mb-3"
                      />
                      {filteredScripts.length > 0 ? (
                        filteredScripts.map((script) => (
                          <div key={script._id} className="mb-2">
                            <div className="font-bold">{script.category}</div>
                            <div className="ml-2">{script.activity}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No scripts available</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 max-w-3xl mx-auto">
  <h1 className="text-xl font-semibold mb-2">📚 Documentation & Tutorials</h1>
  {resources.length === 0 ? (
    <p className="text-gray-500 text-sm">Loading resources...</p>
  ) : (
    <div className="grid gap-3">
      {resources.map((resource) => (
        <div key={resource._id} className="p-3 shadow-sm border border-gray-300 rounded-md bg-white">
          <a
            href={resource.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-blue-600 hover:underline"
          >
            {resource.title}
          </a>
          <p className="text-xs text-gray-600">{resource.description}</p>
        </div>
      ))}
    </div>
  )}
</div>  



                {/* Add New Script Form */}
                <div className="space-y-4">
                  <h3 className="font-medium">Add New Script</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Script Name"
                    className="w-full p-2 border rounded"
                    value={newScript.name}
                    onChange={handleNewScriptInputChange}
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    className="w-full p-2 border rounded"
                    value={newScript.category}
                    onChange={handleNewScriptInputChange}
                  />
                  <textarea
                    name="code"
                    placeholder="Script Code"
                    className="w-full p-2 border rounded min-h-[100px]"
                    value={newScript.code}
                    onChange={handleNewScriptInputChange}
                  />
                  <button
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    onClick={handleAddNewScript}
                  >
                    Add Script
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Review & Feedback and Final Report */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Review & Feedback</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Script Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={selectedScript?.name || ""}
                    readOnly
                  />
                </div>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">Upload a file</div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <div>
                  <label className="block mb-2">Observed Behavior</label>
                  <textarea
                    className="w-full p-2 border rounded min-h-[100px]"
                    value={observedBehavior}
                    onChange={(e) => setObservedBehavior(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    Potential Vulnerabilities Identified
                  </label>
                  <textarea
                    className="w-full p-2 border rounded min-h-[100px]"
                    value={vulnerabilities}
                    onChange={(e) => setVulnerabilities(e.target.value)}
                  />
                </div>
                <button
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  onClick={(e) => handleSubmitReview(e)}
                >
                  Submit Review
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Final Report</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Report Summary</label>
                  <textarea
                    placeholder="Provide a comprehensive summary of your findings..."
                    className="w-full p-2 border rounded min-h-[100px]"
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2">Difficulty Rating</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={difficultyRating}
                    onChange={(e) => setDifficultyRating(e.target.value)}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <button
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  onClick={(e) => handleFinalReportSubmit(e)}
                >
                  Submit Final Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SecurityTestingDashboard;
