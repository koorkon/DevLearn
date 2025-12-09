const openaiService = require('../services/openaiService');

class MCQController {
  async generateMCQs(req, res) {
    try {
      const { topic } = req.body;

      if (!topic || !topic.trim()) {
        return res.status(400).json({ success: false, error: 'Topic is required' });
      }

      // Call openaiService directly, not the API endpoint
      const questions = await openaiService.generateMCQs(topic);

      res.json({
        success: true,
        topic: topic,
        questions: questions,
        count: questions.length,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('MCQ generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate questions',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  async validateAnswer(req, res) {
    try {
      const { questionId, userAnswer, correctAnswer } = req.body;

      if (userAnswer === undefined || correctAnswer === undefined) {
        return res.status(400).json({ error: 'Both userAnswer and correctAnswer are required' });
      }

      const isCorrect = userAnswer === correctAnswer;

      res.json({
        success: true,
        isCorrect: isCorrect,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer
      });

    } catch (error) {
      console.error('Answer validation error:', error);
      res.status(500).json({ error: 'Failed to validate answer' });
    }
  }

  async getDefaultMCQs(req, res) {
    try {
      const { topic } = req.query;

      if (!topic) {
        return res.status(400).json({ error: 'Topic query parameter is required' });
      }

      const questions = openaiService.getDefaultMCQs(topic);

      res.json({
        success: true,
        topic: topic,
        questions: questions,
        count: questions.length,
        note: 'Default questions (AI service unavailable)'
      });

    } catch (error) {
      console.error('Error getting default MCQs:', error);
      res.status(500).json({ error: 'Failed to get questions' });
    }
  }
}

module.exports = new MCQController();