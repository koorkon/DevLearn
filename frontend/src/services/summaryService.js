import api from '../api/axios.config'
import { API_ENDPOINTS } from '../api/endpoints'

export const summaryService = {
  async generateSummary(documentId, style = 'detailed') {
    const response = await api.post(API_ENDPOINTS.SUMMARIES, {
      documentId,
      style
    })
    return response.data
  },

  async getSummariesByDocument(documentId) {
    const response = await api.get(API_ENDPOINTS.SUMMARIES_BY_DOCUMENT(documentId))
    return response.data
  },

  async getSummaryById(id) {
    const response = await api.get(API_ENDPOINTS.SUMMARY_BY_ID(id))
    return response.data
  }
}
