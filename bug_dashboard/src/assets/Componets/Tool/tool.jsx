import React, { useState } from 'react';
import { ChevronDown, Upload, Plus } from 'lucide-react';

const SecurityTestingDashboard = () => {
  const [scriptName, setScriptName] = useState('');
  const [category, setCategory] = useState('');
  const [scriptCode, setScriptCode] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [difficultyRating, setDifficultyRating] = useState('Medium');
  
  // State for dropdowns
  const [isTestingScriptsOpen, setIsTestingScriptsOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);

  // Testing scripts data
  const standardScripts = {
    'XSS': {
      description: 'Cross-site scripting test scripts',
      scripts: [
        'Basic XSS Test',
        'DOM-based XSS Test',
        'Stored XSS Test'
      ]
    },
    'SQL Injection': {
      description: 'SQL injection test scripts',
      scripts: [
        'Basic SQL Injection',
        'Time-based Blind',
        'Union-based Test'
      ]
    }
  };

  // Handle script selection
  const handleScriptSelect = (scriptType, script) => {
    setSelectedScript({ type: scriptType, name: script });
    setScriptName(script);
    // Add example script code based on selection
    setScriptCode(`// ${script} Template\n// Add your test cases here\n`);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Add your file handling logic here
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Task ID: BH-001</h1>
          <a href="https://example.com/target-app" className="text-blue-500 hover:underline text-sm">
            https://example.com/target-app
          </a>
        </div>
        <span className="text-blue-500">In Progress</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Help & Resources</h2>
            <div className="space-y-4">
              {/* Testing Scripts Dropdown */}
              <div className="border rounded-lg">
                <button 
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setIsTestingScriptsOpen(!isTestingScriptsOpen)}
                >
                  <span>Standard Testing Scripts</span>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${isTestingScriptsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isTestingScriptsOpen && (
                  <div className="border-t p-3">
                    {Object.entries(standardScripts).map(([category, content]) => (
                      <div key={category} className="mb-4">
                        <h3 className="font-medium mb-2">{category}</h3>
                        <div className="space-y-2 pl-4">
                          {content.scripts.map((script) => (
                            <button
                              key={script}
                              className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                              onClick={() => handleScriptSelect(category, script)}
                            >
                              {script}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-3">
                <h3 className="font-medium mb-2">Documentation & Tutorials</h3>
                <ul className="space-y-2 text-blue-500">
                  <li><a href="#" className="hover:underline">Web Security Testing Guide</a></li>
                  <li><a href="#" className="hover:underline">API Security Testing Best Practices</a></li>
                  <li><a href="#" className="hover:underline">Common Vulnerability Guide</a></li>
                </ul>
              </div>

              {/* Add New Script Form */}
              <div className="space-y-4">
                <h3 className="font-medium">Add New Script</h3>
                <input
                  type="text"
                  placeholder="Script Name"
                  className="w-full p-2 border rounded"
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full p-2 border rounded"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <textarea
                  placeholder="Script Code"
                  className="w-full p-2 border rounded min-h-[100px]"
                  value={scriptCode}
                  onChange={(e) => setScriptCode(e.target.value)}
                />
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  Add Script
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Review & Feedback</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Script Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selectedScript?.name || ''}
                  readOnly
                />
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
                   onClick={() => document.getElementById('file-upload').click()}>
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
                <textarea className="w-full p-2 border rounded min-h-[100px]" />
              </div>

              <div>
                <label className="block mb-2">Potential Vulnerabilities Identified</label>
                <textarea className="w-full p-2 border rounded min-h-[100px]" />
              </div>

              <div>
                <label className="block mb-2">Supporting Files</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
                     onClick={() => document.getElementById('supporting-files').click()}>
                  <Plus className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">Add files</div>
                  <input 
                    id="supporting-files" 
                    type="file" 
                    multiple 
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
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

              <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
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