import React, { useState } from 'react'
import { Upload, FileText, HelpCircle, Layers, Sparkles } from 'lucide-react'
import FileUpload from '../components/upload/FileUpload'
import FilePreview from '../components/upload/FilePreview'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function UploadPage() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState('upload')

  const features = [
    {
      icon: FileText,
      title: 'Smart Summaries',
      description: 'Get concise summaries highlighting key concepts and main ideas from your documents.',
      benefits: ['Key point extraction', 'Structured formatting', 'Study-ready content']
    },
    {
      icon: HelpCircle,
      title: 'Practice MCQs',
      description: 'Test your understanding with AI-generated multiple choice questions and explanations.',
      benefits: ['Instant feedback', 'Detailed explanations', 'Progress tracking']
    },
    {
      icon: Layers,
      title: 'Interactive Flashcards',
      description: 'Master concepts with digital flashcards using spaced repetition techniques.',
      benefits: ['Active recall', 'Spaced repetition', 'Mobile-friendly']
    }
  ]

  const handleDeleteFile = (filename) => {
    dispatch({
      type: 'SET_UPLOADED_FILES',
      payload: state.uploadedFiles.filter(file => file.filename !== filename)
    })
  }

  const handleDownloadFile = (file) => {
    // Simulate file download
    const blob = new Blob([file.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.originalFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-2 rounded-full">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered Learning</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Upload Your Study Materials
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your PDFs, PowerPoint files, and documents into interactive study resources
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
            <div className="flex space-x-2">
              {['upload', 'files'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'upload' ? 'Upload New' : 'My Files'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {activeTab === 'upload' ? (
              <FileUpload />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Uploaded Files ({state.uploadedFiles.length})
                  </h3>
                </div>

                {state.uploadedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      No files uploaded yet
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Upload your first file to generate study materials
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {state.uploadedFiles.map((file, index) => (
                      <FilePreview
                        key={index}
                        file={file}
                        onDelete={() => handleDeleteFile(file.filename)}
                        onDownload={() => handleDownloadFile(file)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              What You'll Get
            </h3>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="text-xs text-gray-500 flex items-center">
                          <div className="w-1 h-1 bg-primary-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Supported Formats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              Supported Formats
            </h3>
            <div className="space-y-3">
              {[
                { type: 'PDF', icon: '📄', maxSize: '10MB' },
                { type: 'PowerPoint', icon: '📊', maxSize: '10MB' },
                { type: 'Text', icon: '📝', maxSize: '5MB' }
              ].map((format, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{format.icon}</span>
                    <span className="font-medium text-gray-900">{format.type}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {format.maxSize}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-3">
              Pro Tip 💡
            </h3>
            <p className="text-primary-100 text-sm leading-relaxed">
              For best results, upload well-structured documents with clear headings and organized content.
              The AI works best with educational materials, textbooks, and presentation slides.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
