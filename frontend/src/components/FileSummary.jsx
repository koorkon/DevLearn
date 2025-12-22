// components/FileSummary.jsx
import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api/summary/upload'; 

const FileSummary = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [stats, setStats] = useState(null); 

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid file type (TXT, PDF, DOC, DOCX)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setSummary('');
    setUploadProgress(0);
    setIsCopied(false);
    setStats(null); 

    generateSummaryFromAPI(file);
  };

  const handleCopy = () => {
    if (summary && !summary.startsWith("Error:")) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); 
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy summary.');
        });
    }
  };

  const generateSummaryFromAPI = async (file) => {
    setLoading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file); 

    // Create a variable to store the interval so we can clear it in finally
    let progressInterval;

    try {
      progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errorMsg = `Server responded with status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (e) {
            // If parsing JSON fails, keep the default errorMsg
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setStats(data.stats); 
        setUploadProgress(100);
      } else {
        throw new Error(data.error || 'Summary generation failed on the server.');
      }

    } catch (error) {
      console.error('Error generating summary:', error.message);
      setSummary(`Error: Failed to generate summary. \n\nDetails: ${error.message}.\n\n(Troubleshooting Tip: Ensure your backend server is running and your OpenAI API Key is valid.)`);
      setStats(null);
      setUploadProgress(0);
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const currentStats = stats;

  return (
    <div className="p-8">
      <h2 className="mb-6 text-3xl font-extrabold text-white">AI File Summary</h2>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Side: Upload & Input */}
        <div className="md:col-span-1">
          <div className="p-6 mb-6 border shadow-xl glass-dark rounded-2xl border-white/10">
            <label className="block mb-3 text-sm font-medium text-gray-300">
              1. Select a file (TXT, PDF, DOCX)
            </label>
            <input 
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              accept=".txt,.pdf,.doc,.docx"
              disabled={loading} 
            />
          </div>

          <div className="p-6 border shadow-xl glass-dark rounded-2xl border-white/10">
            <h3 className="mb-4 text-xl font-bold text-white">File Status</h3>
            {selectedFile ? (
              <div>
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">File:</span> {selectedFile.name}
                </p>
                <p className="mb-4 text-sm text-gray-300">
                  <span className="font-semibold">Size:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {loading && (
                  <div>
                    <p className="mb-2 text-sm text-purple-400">Processing...</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {summary && !summary.startsWith("Error:") && (
                  <p className="mt-4 text-sm font-semibold text-green-400">
                    ✅ Summary Generated!
                  </p>
                )}
                 {summary && summary.startsWith("Error:") && (
                  <p className="mt-4 text-sm font-semibold text-red-400">
                    ❌ Summary Error!
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No file selected.</p>
            )}
          </div>
        </div>

        {/* Right Side: Summary Result */}
        <div className="md:col-span-2">
          {loading && !summary ? (
            <div className="flex items-center justify-center h-full border glass-dark rounded-2xl border-white/10 min-h-96">
              <div className="p-8 text-center">
                <svg className="w-8 h-8 mx-auto mb-4 text-purple-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg text-purple-400">Generating AI Summary...</p>
                <p className="mt-1 text-sm text-gray-400">Analyzing {selectedFile?.name} ({uploadProgress}%)</p>
              </div>
            </div>
          ) : summary ? (
            <div className="h-full p-6 border shadow-2xl glass-dark rounded-2xl border-white/10">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h3 className="text-2xl font-bold text-cyan-400">AI Summary Result</h3>
                
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center space-x-2 ${
                    isCopied
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  disabled={isCopied || summary.startsWith("Error:")} 
                >
                  {isCopied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mb-6 max-h-[400px] overflow-y-auto pr-2">
                <p className={`text-lg font-light leading-relaxed whitespace-pre-wrap ${summary.startsWith("Error:") ? 'text-red-400' : 'text-white'}`}>
                  {summary}
                </p>
              </div>

              {currentStats && !summary.startsWith("Error:") && (
                <div className="flex items-center justify-around pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${currentStats.reductionPercentage > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {currentStats.reductionPercentage}%
                    </div>
                    <div className="text-sm text-gray-400">Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {currentStats.originalLength}
                    </div>
                    <div className="text-sm text-gray-400">Original Chars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {currentStats.summaryLength}
                    </div>
                    <div className="text-sm text-gray-400">Summary Chars</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full border glass-dark rounded-2xl border-white/10 min-h-96">
              <div className="p-8 text-center text-gray-400">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 border rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-lg">AI Summary will appear here</p>
                <p className="mt-2 text-sm">Upload a file and get a summary!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSummary;