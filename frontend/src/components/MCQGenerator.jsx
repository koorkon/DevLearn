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
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setScore(0);
        setShowResults(false);
      } else {
        setError(data.error || 'Failed to generate questions. Please try again.');
        setQuestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch MCQs:", error);
      setError('Unable to connect to the service. Please try again.');
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

  // Initial state - Input screen
  if (questions.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Generate Questions</h2>
          
          {error && (
            <div className="glass-dark rounded-xl p-4 border border-red-500/30 bg-red-500/10 mb-6">
              <p className="text-red-300 text-sm flex items-start">
                <span className="mr-3">⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          <div className="glass-dark rounded-xl p-6 border border-white/10 space-y-4">
            <label className="block">
              <span className="text-gray-300 font-semibold block mb-2">Topic</span>
              <input
                type="text"
                placeholder="e.g., Machine Learning, Biology, History"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateQuestions()}
                disabled={loading}
                className="w-full bg-black/30 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 disabled:opacity-50"
              />
            </label>

            <button
              onClick={generateQuestions}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span> Generating Questions...
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

  // Quiz display screen
  if (!showResults) {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1}/{questions.length}</h2>
              <span className="text-gray-400 text-sm">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-dark rounded-xl p-8 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-8">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="space-y-3 mb-8">
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
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white py-2 rounded-lg font-bold hover:shadow-lg transition-all"
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

  // Results screen
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-dark rounded-xl p-8 border border-white/10 text-center">
          <div className="mb-6">
            <p className="text-6xl mb-4">
              {score === questions.length ? '🎉' : score >= questions.length / 2 ? '✅' : '💪'}
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          </div>

          {/* Score Card */}
          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <p className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              {score}/{questions.length}
            </p>
            <p className="text-xl text-gray-300 mb-4">
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
          <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  userAnswers[idx] === q.correctAnswer
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <p className="text-sm text-gray-300 mb-2">
                  <span className={userAnswers[idx] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}>
                    Q{idx + 1}: {userAnswers[idx] === q.correctAnswer ? '✓' : '✗'}
                  </span>
                </p>
                {userAnswers[idx] !== q.correctAnswer && (
                  <p className="text-xs text-gray-400">
                    <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
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