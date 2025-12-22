const Groq = require('groq-sdk');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateSummary(content) {
    try {
      const inputBuffer = content.length > 500 ? content.slice(0, 10000) : content;

      const response = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an academic assistant. Provide a concise summary of the main educational concepts related to the provided topic or text. Use bullet points."
          },
          { role: "user", content: inputBuffer }
        ],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Summary Error:", error.message);
      throw new Error("AI failed to generate summary: " + error.message);
    }
  }

  async generateFlashcards(topicOrText) {
    try {
      // Prepare input for the model
      const cleanInput = topicOrText.slice(0, 6000);

      const completion = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Return ONLY a JSON object with a key 'flashcards' containing an array of 5 objects with 'question' and 'answer'. No prose."
          },
          { role: "user", content: `Generate flashcards for: ${cleanInput}` }
        ],
        response_format: { type: "json_object" }
      });

      const data = JSON.parse(completion.choices[0].message.content);
      return data.flashcards || [];
    } catch (error) {
      console.error("Flashcard Error:", error.message);
      throw new Error("AI failed to generate flashcards: " + error.message);
    }
  }

  async generateMCQs(topicOrText) {
    try {
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Return ONLY a JSON object with a key 'mcqs'. Each object must have: 'question', 'options' (array of 4), and 'correctAnswer' (the integer index 0-3 of the correct option). Each object MUST have: - 'question' (string) - 'options' (array of 4 strings) - 'correctAnswer' (integer 0-3 representing the index of the correct option). No prose."
          },
          { role: "user", content: `Generate 5 MCQs for: ${topicOrText}` }
        ],
        response_format: { type: "json_object" }
      });

      const data = JSON.parse(completion.choices[0].message.content);
      return data.mcqs || [];
    } catch (error) {
      console.error("AI Error:", error.message);
      throw error;
    }
  }
}

module.exports = new AIService();