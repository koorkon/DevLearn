import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { fileService } from '../services/fileService'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { dispatch } = useApp()

  const uploadFile = async (file) => {
    try {
      setUploading(true)
      setProgress(0)

      // Validate file
      fileService.validateFile(file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload file
      const result = await fileService.uploadFile(file)

      clearInterval(progressInterval)
      setProgress(100)

      dispatch({ type: 'ADD_FILE', payload: result })

      setTimeout(() => setProgress(0), 1000)
      return result

    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Failed to upload file'
      })
      setProgress(0)
      throw error
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadFile,
    uploading,
    progress
  }
}
