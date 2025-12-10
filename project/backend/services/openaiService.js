const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY is not set in .env file');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generateText(prompt, maxTokens = 500) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a helpful educational assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      throw new Error('AI service temporarily unavailable. Using default content.');
    }
  }

  async generateJSON(systemPrompt, userPrompt, maxTokens = 1000) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI JSON Error:', error.message);
      throw new Error('Failed to generate structured response');
    }
  }

  async generateFlashcards(topic) {
    const system = `You are an educational assistant that generates flashcards. Output valid JSON.`;
    
    const prompt = `Generate 5 flashcards about "${topic}".
Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "id": 1,
      "front": "What is the definition?",
      "back": "The answer or explanation",
      "category": "Definition",
      "difficulty": "easy",
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

    try {
      const data = await this.generateJSON(system, prompt, 1200);
      return data.flashcards || data;
    } catch (error) {
      console.error('Flashcard generation failed:', error.message);
      return this.getDefaultFlashcards(topic);
    }
  }

  async generateMCQs(topic) {
    const system = `You are an educational assistant. Generate multiple choice questions. Output ONLY valid JSON.`;
    
    const prompt = `Generate 4 multiple choice questions about "${topic}".
Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this is correct"
    }
  ]
}`;

    try {
      const data = await this.generateJSON(system, prompt, 1200);
      return data.questions || data;
    } catch (error) {
      console.error('MCQ generation failed:', error.message);
      return this.getDefaultMCQs(topic);
    }
  }

  async generateSummary(text) {
    const prompt = `Summarize this text concisely:

${text.substring(0, 3000)}

Provide key points in clear sections.`;

    try {
      return await this.generateText(prompt, 500);
    } catch (error) {
      console.error('Summary generation failed:', error.message);
      return this.getDefaultSummary(text);
    }
  }

  getDefaultFlashcards(topic) {
    return [
      {
        id: 1,
        front: `What is ${topic}?`,
        back: `${topic} is an important subject. (Note: Using default content - please check your API connection)`,
        category: 'Definition',
        difficulty: 'easy',
        tags: ['offline']
      },
      {
        id: 2,
        front: `Key aspects of ${topic}`,
        back: `This includes important concepts and applications.`,
        category: 'Concepts',
        difficulty: 'medium',
        tags: ['practical']
      },
      {
        id: 3,
        front: `How to apply ${topic}?`,
        back: `Can be applied in various real-world scenarios.`,
        category: 'Application',
        difficulty: 'medium',
        tags: ['practice']
      }
    ];
  }

  getDefaultMCQs(topic) {
    return [
      {
        id: 1,
        question: `What is ${topic}?`,
        options: ["A fundamental concept", "A technical skill", "A practical application", "All of the above"],
        correctAnswer: 3,
        explanation: `${topic} encompasses all these aspects.`
      },
      {
        id: 2,
        question: `Why is ${topic} important?`,
        options: ["For learning", "For career growth", "For problem solving", "All of the above"],
        correctAnswer: 3,
        explanation: `${topic} is important for multiple reasons.`
      }
    ];
  }

  getDefaultSummary(text) {
    const wordCount = text.split(/\s+/).length;
    return `# Summary

This document contains approximately ${wordCount} words.

**Key Points:**
- This is default content because AI service is unavailable
- Please ensure your OpenAI API key is valid and has available credits
- Check your internet connection
- Verify your API usage limits haven't been exceeded

**Note:** Connect a valid OpenAI API for AI-powered summaries and content generation.`;
  }
}

module.exports = new OpenAIService();