import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { useFileUpload } from '../../hooks/useFileUpload'

export default function FileUpload() {
  const [file, setFile] = useState(null)
  const { uploadFile, uploading, progress } = useFileUpload()

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  })

  const handleUpload = async () => {
    if (!file) return

    try {
      await uploadFile(file)
      setFile(null)
    } catch (error) {
      // Error handled in hook
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-25'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />

        <div className="space-y-4">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Upload className="h-8 w-8 text-primary-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload Study Material'}
            </h3>
            <p className="text-gray-600 text-sm">
              Drag & drop your PDF, PowerPoint, or text file here, or click to browse
            </p>
          </div>

          <div className="text-xs text-gray-500">
            Supports: PDF, PPT, PPTX, TXT • Max 10MB
          </div>
        </div>
      </div>

      {/* File Preview */}
      {file && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary-500" />
              <div>
                <h4 className="font-medium text-gray-800">{file.name}</h4>
                <p className="text-sm text-gray-600">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4 space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 text-center">
                {progress < 100 ? 'Uploading...' : 'Processing...'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      {file && !uploading && (
        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Generate Study Materials</span>
          </div>
        </button>
      )}

      {/* Success Message */}
      {progress === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-green-800 font-medium">Upload Successful!</p>
              <p className="text-green-700 text-sm">
                Your file has been processed. You can now generate study materials.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
