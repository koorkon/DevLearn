import React from 'react'
import { AlertCircle, X } from 'lucide-react'

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
