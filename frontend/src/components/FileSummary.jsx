import React, { useState } from 'react';

const FileSummary = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
      setFileContent('');
      setError(null);
    }
  };

  const handleTextChange = (e) => {
    setFileContent(e.target.value);
    setSelectedFile(null);
    setError(null);
  };

  const generateSummary = async () => {
    if (!fileContent.trim() && !selectedFile) {
      setError('Please provide content to summarize');
      return;
    }

    setLoading(true);
    setSummary('');
    setError(null);
    setStats(null);

    try {
      let response;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        response = await fetch('http://localhost:5000/api/summary/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:5000/api/summary/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fileContent }),
        });
      }

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setError(data.error || 'Unable to generate summary at this time. Please try again.');
      }

    } catch (err) {
      console.error('Summary error:', err);
      setError('Unable to connect to the service. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFileContent('');
    setSelectedFile(null);
    setSummary('');
    setError(null);
    setStats(null);
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Upload or Paste</h2>

          {/* Error Alert */}
          {error && (
            <div className="glass-dark rounded-xl p-4 border border-red-500/30 bg-red-500/10">
              <p className="text-red-300 text-sm flex items-start">
                <span className="mr-3">⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="glass-dark rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all">
            <label className="block">
              <span className="text-gray-300 font-semibold block mb-3">📄 Upload Document</span>
              <span className="text-gray-500 text-xs block mb-3">Supports: TXT, PDF, DOC, DOCX (Max 5MB)</span>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={loading}
                className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 disabled:opacity-50 cursor-pointer"
              />
            </label>
            {selectedFile && (
              <p className="text-sm text-green-400 mt-3">✓ {selectedFile.name} selected</p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-gray-500 text-xs uppercase">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Text Input */}
          <div className="glass-dark rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all">
            <label className="block">
              <span className="text-gray-300 font-semibold block mb-3">✏️ Paste Text</span>
              <textarea
                value={fileContent}
                onChange={handleTextChange}
                placeholder="Paste your text here..."
                disabled={loading}
                rows={10}
                className="w-full bg-black/30 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 resize-none disabled:opacity-50"
              />
            </label>
            <p className="text-gray-500 text-xs mt-2">
              {fileContent.length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={generateSummary}
              disabled={(!fileContent.trim() && !selectedFile) || loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span> Generating...
                </span>
              ) : (
                'Generate Summary'
              )}
            </button>
            <button
              onClick={clearAll}
              disabled={loading}
              className="flex-1 bg-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Summary Result</h2>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-dark rounded-lg p-4 border border-white/10 text-center">
                <p className="text-gray-400 text-xs uppercase mb-1">Original</p>
                <p className="text-white font-bold">{stats.originalLength}</p>
                <p className="text-gray-500 text-xs">chars</p>
              </div>
              <div className="glass-dark rounded-lg p-4 border border-white/10 text-center">
                <p className="text-gray-400 text-xs uppercase mb-1">Summary</p>
                <p className="text-white font-bold">{stats.summaryLength}</p>
                <p className="text-gray-500 text-xs">chars</p>
              </div>
              <div className="glass-dark rounded-lg p-4 border border-white/10 text-center">
                <p className="text-gray-400 text-xs uppercase mb-1">Reduction</p>
                <p className="text-green-400 font-bold">{stats.reductionPercentage}%</p>
                <p className="text-gray-500 text-xs">compressed</p>
              </div>
            </div>
          )}

          {/* Summary Content */}
          <div className="glass-dark rounded-xl p-6 border border-white/10 min-h-96 max-h-96 overflow-y-auto">
            {!summary ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500 text-lg">📝</p>
                <p className="text-gray-400 mt-3">
                  {loading ? 'Analyzing your content...' : 'Summary will appear here'}
                </p>
              </div>
            ) : (
              <div className="text-gray-200 space-y-3">
                {summary.split('\n').filter(line => line.trim()).map((line, idx) => (
                  <p key={idx} className="text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Copy Button */}
          {summary && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                alert('Summary copied to clipboard!');
              }}
              className="w-full bg-white/10 text-white py-2 rounded-lg font-semibold hover:bg-white/20 transition-all text-sm"
            >
              📋 Copy Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSummary;