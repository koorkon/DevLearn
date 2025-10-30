import api from '../api/axios.config'
import { API_ENDPOINTS } from '../api/endpoints'

export const mcqService = {
  async generateMCQs(documentId, numberOfQuestions = 5, difficulty = 'medium') {
    const response = await api.post(API_ENDPOINTS.MCQS, {
      documentId,
      numberOfQuestions,
      difficulty
    })
    return response.data
  },

  async getMCQsByDocument(documentId) {
    const response = await api.get(API_ENDPOINTS.MCQS_BY_DOCUMENT(documentId))
    return response.data
  },

  async getMCQById(id) {
    const response = await api.get(API_ENDPOINTS.MCQ_BY_ID(id))
    return response.data
  }
}
