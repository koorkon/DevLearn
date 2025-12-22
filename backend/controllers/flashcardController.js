const aiService = require('../services/aiService');
const fileService = require('../services/fileService');

const generateFlashcards = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const flashcards = await aiService.generateFlashcards(topic);

    res.json({ success: true, flashcards });
  } catch (error) {
    console.error("Flashcard Controller Error:", error.message);
    res.status(500).json({ 
      error: "Failed to generate cards.", 
      details: error.message 
    });
  }
};

const getDefaultFlashcards = async (req, res) => {
  const defaultCards = [
    { question: "What is an Atom?", answer: "The basic unit of a chemical element." }
  ];
  res.json({ success: true, flashcards: defaultCards });
};

module.exports = {
  generateFlashcards,
  getDefaultFlashcards
};