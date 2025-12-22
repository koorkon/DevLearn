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
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || 'Failed to generate');

      setQuestions(data.mcqs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  const submitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const userSelectedText = q.options[userAnswers[idx]];
      
      // FIX: Check if answer matches by Index OR by exact Text
      if (userAnswers[idx] === q.correctAnswer || userSelectedText === q.correctAnswer) {
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

  if (questions.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto">
          <h2 className="mb-6 text-2xl font-bold text-white">Generate Questions</h2>
          {error && (
            <div className="p-4 mb-6 border rounded-xl border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}
          <div className="p-6 space-y-4 border glass-dark rounded-xl border-white/10">
            <input
              type="text"
              placeholder="e.g., DevOps, Biology, History"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 text-white bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={generateQuestions}
              disabled={loading || !topic.trim()}
              className="w-full py-3 font-bold text-white rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 disabled:opacity-50"
            >
              {loading ? '⏳ Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showResults) {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1}/{questions.length}</h2>
          <div className="w-full h-2 mt-4 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-green-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="p-8 border glass-dark rounded-xl border-white/10">
          <h3 className="mb-8 text-xl font-bold text-white">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className={`flex items-center p-4 border rounded-lg cursor-pointer ${userAnswers[currentQuestionIndex] === index ? 'bg-green-500/20 border-green-500' : 'bg-black/20 border-white/10'}`}>
                <input type="radio" checked={userAnswers[currentQuestionIndex] === index} onChange={() => handleAnswer(currentQuestionIndex, index)} className="hidden" />
                <span className="text-gray-200">{option}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-8 gap-3">
            <button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} disabled={currentQuestionIndex === 0} className="px-6 py-2 text-white bg-white/10 rounded-lg disabled:opacity-30">← Previous</button>
            {currentQuestionIndex === questions.length - 1 ? 
              <button onClick={submitQuiz} className="flex-1 py-2 font-bold text-white bg-green-500 rounded-lg">Submit Quiz</button> :
              <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={userAnswers[currentQuestionIndex] === undefined} className="flex-1 py-2 font-bold text-white bg-green-500 rounded-lg">Next →</button>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="p-8 text-center border glass-dark rounded-xl border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
        <div className="p-6 mb-6 rounded-lg bg-black/30">
          <p className="text-5xl font-bold text-green-400">{score}/{questions.length}</p>
          <p className="text-xl text-gray-300 mt-2">{Math.round((score / questions.length) * 100)}% Correct</p>
        </div>
        <div className="space-y-4 text-left max-h-96 overflow-y-auto pr-2">
          {questions.map((q, idx) => {
            const userIdx = userAnswers[idx];
            const userText = q.options[userIdx] || "Not Answered";
            
            // FIX: Determine if correct by Index or Text
            const isCorrect = userIdx === q.correctAnswer || userText === q.correctAnswer;
            
            // FIX: Find the correct text regardless of if correctAnswer is index or string
            const correctText = typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : q.correctAnswer;

            return (
              <div key={idx} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className="text-white font-semibold mb-2">Q{idx + 1}: {q.question}</p>
                <p className={`p-2 rounded mb-2 text-sm ${isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {isCorrect ? '✓' : '✗'} Your Answer: {userText}
                </p>
                {!isCorrect && <p className="p-2 rounded text-sm bg-green-700/50 text-white font-medium">Correct Answer: {correctText}</p>}
              </div>
            );
          })}
        </div>
        <button onClick={resetQuiz} className="w-full mt-6 py-3 font-bold text-white bg-green-500 rounded-lg">Try Another Topic</button>
      </div>
    </div>
  );
};

export default MCQGenerator;