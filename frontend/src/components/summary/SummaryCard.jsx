import React, { useState } from 'react'
import { Copy, Check, Expand, BookOpen } from 'lucide-react'

export default function SummaryCard({ summary }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const displayContent = expanded
    ? summary.content
    : summary.content.substring(0, 300) + (summary.content.length > 300 ? '...' : '')

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-pastel-blue p-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {summary.title}
            </h3>
            <p className="text-sm text-gray-600">
              From: {summary.documentName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Copy summary"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          {summary.content.length > 300 && (
            <button
              onClick={toggleExpand}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title={expanded ? 'Show less' : 'Show more'}
            >
              <Expand className={`h-4 w-4 transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        <div className="bg-pastel-blue rounded-xl p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {displayContent}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>
            {Math.ceil(summary.content.split(' ').length / 200)} min read
          </span>
          <span>•</span>
          <span>
            {new Date(summary.createdAt).toLocaleDateString()}
          </span>
        </div>

        {!expanded && summary.content.length > 300 && (
          <button
            onClick={toggleExpand}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  )
}
