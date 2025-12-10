import api from '../api/axios.config'
import { API_ENDPOINTS } from '../api/endpoints'

export const flashcardService = {
  async generateFlashcards(documentId, numberOfCards = 10) {
    const response = await api.post(API_ENDPOINTS.FLASHCARDS, {
      documentId,
      numberOfCards
    })
    return response.data
  },

  async getFlashcardsByDocument(documentId) {
    const response = await api.get(API_ENDPOINTS.FLASHCARDS_BY_DOCUMENT(documentId))
    return response.data
  },

  async getFlashcardById(id) {
    const response = await api.get(API_ENDPOINTS.FLASHCARD_BY_ID(id))
    return response.data
  }
}
