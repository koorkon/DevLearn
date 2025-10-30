import api from '../api/axios.config'
import { API_ENDPOINTS } from '../api/endpoints'

export const fileService = {
  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(API_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  async getSupportedFormats() {
    return ['.pdf', '.ppt', '.pptx', '.txt']
  },

  validateFile(file) {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB')
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a PDF, PowerPoint, or text file')
    }

    return true
  }
}
