import React from 'react'
import { Loader } from 'lucide-react'

export default function UploadProgress({ progress, status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'text-blue-500'
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading file...'
      case 'processing':
        return 'Processing content...'
      case 'generating':
        return 'Generating study materials...'
      case 'success':
        return 'Complete!'
      case 'error':
        return 'Upload failed'
      default:
        return 'Preparing...'
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Upload Progress</h3>
        <span className={`text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-between text-xs text-gray-600">
          <span className={progress >= 25 ? 'text-primary-600 font-medium' : ''}>
            Upload
          </span>
          <span className={progress >= 50 ? 'text-primary-600 font-medium' : ''}>
            Process
          </span>
          <span className={progress >= 75 ? 'text-primary-600 font-medium' : ''}>
            Generate
          </span>
          <span className={progress >= 100 ? 'text-primary-600 font-medium' : ''}>
            Complete
          </span>
        </div>

        {/* Loading Animation */}
        {status !== 'success' && status !== 'error' && (
          <div className="flex justify-center pt-2">
            <Loader className="h-5 w-5 text-primary-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
