import React, { useState } from 'react';

const MCQGenerator = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuestions = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      
      if (!response.ok) {
        // 🚀 CRITICAL FIX: Attempt to read the specific error message from the back-end
        let errorData = {};
        try {
            errorData = await response.json();
        } catch(e) {
            // If the server didn't send JSON, throw a generic network error
            throw new Error(`Server returned status ${response.status}. Check server console.`);
        }
        
        // Throw an error using the specific detail message (details key is from mcqController)
        throw new Error(errorData.details || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setScore(0);
        setShowResults(false);
      } else {
        // Handle case where success is true but no questions were returned (unlikely with service fix)
        setError(data.error || 'Failed to generate questions. Try a different topic.');
        setQuestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch MCQs:", error);
      
      // 🚀 CRITICAL FIX: Display the specific error message to the user
      if (error.message.includes('Failed to fetch')) {
           setError('Unable to connect to back-end server. Ensure Node.js server is running.');
      } else {
           setError(error.message); // This displays the detailed AI error
      }
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex
    });
  };

  const submitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      // Comparison now works because q.correctAnswer is guaranteed to be a number (from service fix)
      if (userAnswers[idx] === q.correctAnswer) { 
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    setError(null);
  };

  // --- RENDERING LOGIC ---

  if (questions.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto">
          <h2 className="mb-6 text-2xl font-bold text-white">Generate Questions</h2>
          
          {error && (
            <div className="p-4 mb-6 border glass-dark rounded-xl border-red-500/30 bg-red-500/10">
              <p className="flex items-start text-sm text-red-300">
                <span className="mr-3">⚠️</span>
                <span>{error}</span>
              </p>
              {error.includes('AI service temporarily unavailable') && (
                <p className="mt-2 text-xs font-semibold text-red-300">
                  **Action Required:** Please check your back-end server console for the exact OpenAI error message (e.g., "Invalid API Key" or "Quota Exceeded").
                </p>
              )}
            </div>
          )}

           <div className="p-6 space-y-4 border glass-dark rounded-xl border-white/10">
            <label className="block">
              <span className="block mb-2 font-semibold text-gray-300">Topic</span>
              <input
                type="text"
                placeholder="e.g., Machine Learning, Biology, History"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateQuestions()}
                disabled={loading}
                className="w-full p-3 text-white placeholder-gray-500 border rounded-lg bg-black/30 border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </label>

            <button
              onClick={generateQuestions}
              disabled={loading || !topic.trim()}
              className="w-full py-3 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2 animate-spin">⏳</span> Generating Questions...
                </span>
              ) : (
                'Generate Questions'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz display screen (same as before)
  if (!showResults) {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1}/{questions.length}</h2>
              <span className="text-sm text-gray-400">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10">
              <div
                className="h-2 transition-all rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-8 mb-8 border glass-dark rounded-xl border-white/10">
            <h3 className="mb-8 text-xl font-bold text-white">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="mb-8 space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-black/20 border-white/10 hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    checked={userAnswers[currentQuestionIndex] === index}
                    onChange={() => handleAnswer(currentQuestionIndex, index)}
                    className="w-4 h-4 text-green-500"
                  />
                  <span className="ml-3 text-gray-200">{option}</span>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 text-white transition-all rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  className="flex-1 py-2 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 hover:shadow-lg"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  disabled={userAnswers[currentQuestionIndex] === undefined}
                  className="flex-1 py-2 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 hover:shadow-lg"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen (FIXED DISPLAY LOGIC)
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 text-center border glass-dark rounded-xl border-white/10">
          <div className="mb-6">
            <p className="mb-4 text-6xl">
              {score === questions.length ? '🎉' : score >= questions.length / 2 ? '✅' : '💪'}
            </p>
            <h2 className="mb-2 text-3xl font-bold text-white">Quiz Complete!</h2>
          </div>

          {/* Score Card */}
          <div className="p-6 mb-6 rounded-lg bg-black/30">
            <p className="mb-2 text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
              {score}/{questions.length}
            </p>
            <p className="mb-4 text-xl text-gray-300">
              {Math.round((score / questions.length) * 100)}% Correct
            </p>
            <p className="text-gray-400">
              {score === questions.length
                ? 'Perfect score! Excellent work!'
                : score >= questions.length / 2
                ? 'Good effort! Keep practicing!'
                : 'Keep studying and try again!'}
            </p>
          </div>

          {/* Answer Review */}
          <div className="mb-8 space-y-4 overflow-y-auto max-h-96">
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctAnswer;
              // Check if the user answered the question
              const userAnswered = userAnswers[idx] !== undefined; 
              // Get the option text for display
              const userAnswerOption = userAnswered ? q.options[userAnswers[idx]] : 'No Answer Selected';
              const correctAnswerOption = q.options[q.correctAnswer];

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <p className="mb-3 text-sm font-bold text-gray-200">
                    Q{idx + 1}: {q.question}
                  </p>

                  <div className="space-y-2 text-sm">
                    {/* Display User's Answer in Red or Green Box */}
                    <p className={`p-2 rounded-md ${
                        isCorrect 
                          ? 'bg-green-500 text-white font-semibold' 
                          : 'bg-red-500 text-white font-semibold'
                      }`}
                    >
                      {isCorrect ? '✓ Your Answer:' : '✗ Your Answer:'} {userAnswerOption}
                    </p>
                    
                    {/* Only display the correct answer separately if the user got it wrong */}
                    {!isCorrect && (
                       <p className="p-2 font-semibold text-white rounded-md bg-green-700/80">
                          Correct Answer: {correctAnswerOption}
                       </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 hover:shadow-lg"
            >
              Try Another Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQGenerator;