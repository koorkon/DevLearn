export const API_ENDPOINTS = {
  // Health check
  HEALTH: '/health',

  // File upload
  UPLOAD: '/upload',

  // Summaries
  SUMMARIES: '/summaries',
  SUMMARIES_BY_DOCUMENT: (documentId) => `/summaries/document/${documentId}`,
  SUMMARY_BY_ID: (id) => `/summaries/${id}`,

  // MCQs
  MCQS: '/mcqs',
  MCQS_BY_DOCUMENT: (documentId) => `/mcqs/document/${documentId}`,
  MCQ_BY_ID: (id) => `/mcqs/${id}`,

  // Flashcards
  FLASHCARDS: '/flashcards',
  FLASHCARDS_BY_DOCUMENT: (documentId) => `/flashcards/document/${documentId}`,
  FLASHCARD_BY_ID: (id) => `/flashcards/${id}`,
}
