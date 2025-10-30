import React from 'react'
import { File, Download, Trash2 } from 'lucide-react'

export default function FilePreview({ file, onDelete, onDownload }) {
  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('powerpoint') || type.includes('presentation')) return '📊'
    if (type.includes('text')) return '📝'
    return '📁'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">
            {getFileIcon(file.fileType)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 truncate">
              {file.originalFilename}
            </h4>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span>{formatFileSize(file.fileSize)}</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onDownload}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {file.content && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 line-clamp-3">
            {file.content.substring(0, 200)}...
          </p>
        </div>
      )}
    </div>
  )
}
