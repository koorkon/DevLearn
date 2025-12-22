const aiService = require('../services/aiService');

const generateMCQs = async (req, res) => {
  try {
    // 1. Get the topic from the JSON body instead of a file
    const { topic } = req.body;

    // 2. Validation: Ensure a topic was provided
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Topic is required. Please enter a subject to generate questions." 
      });
    }

    console.log(`Generating MCQs for topic: ${topic}`);

    // 3. Use the updated AIService (which uses llama-3.1-8b-instant)
    const mcqs = await aiService.generateMCQs(topic);

    // 4. Return the generated questions
    res.json({ 
      success: true, 
      mcqs: mcqs 
    });
  } catch (error) {
    console.error("MCQ Generation Error:", error.message);
    res.status(500).json({ 
      error: "Failed to generate MCQs.", 
      details: error.message 
    });
  }
};

const validateAnswer = async (req, res) => {
  try {
    const { userAnswer, correctAnswer } = req.body;
    const isCorrect = userAnswer === correctAnswer;
    res.json({ isCorrect, correctAnswer });
  } catch (error) {
    res.status(500).json({ error: "Validation failed." });
  }
};

const getDefaultMCQs = async (req, res) => {
  const defaultData = [
    {
      question: "Sample: What is the primary purpose of this document?",
      options: ["Information", "Entertainment", "Sales", "Legal"],
      correctAnswer: "Information"
    }
  ];
  res.json({ success: true, mcqs: defaultData });
};

module.exports = {
  generateMCQs,
  validateAnswer,
  getDefaultMCQs
};