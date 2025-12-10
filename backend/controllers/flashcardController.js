const openaiService = require('../services/openaiService');

class FlashcardController {
  async generateFlashcards(req, res) {
    try {
      const { topic } = req.body;

      if (!topic || !topic.trim()) {
        return res.status(400).json({ success: false, error: 'Topic is required' });
      }

      const flashcards = await openaiService.generateFlashcards(topic);

      res.json({
        success: true,
        topic: topic.trim(),
        flashcards: flashcards,
        count: flashcards.length,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Flashcard generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate flashcards',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  async getDefaultFlashcards(req, res) {
    try {
      const { topic } = req.query;

      if (!topic || !topic.trim()) {
        return res.status(400).json({ success: false, error: 'Topic query parameter is required' });
      }

      const flashcards = openaiService.getDefaultFlashcards(topic);

      res.json({
        success: true,
        topic: topic.trim(),
        flashcards: flashcards,
        count: flashcards.length,
        note: 'Default flashcards (AI service unavailable)'
      });

    } catch (error) {
      console.error('Error getting default flashcards:', error);
      res.status(500).json({ success: false, error: 'Failed to get flashcards' });
    }
  }
}

module.exports = new FlashcardController();