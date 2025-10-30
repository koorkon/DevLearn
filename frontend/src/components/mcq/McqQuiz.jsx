import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Trophy, RotateCcw } from 'lucide-react'
import McqCard from './McqCard'

export default function McqQuiz({ mcqs }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentMcq = mcqs[currentIndex]
  const totalQuestions = mcqs.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const handleAnswer = (questionIndex, selectedOption) => {
    const isCorrect = selectedOption === currentMcq.correctOptionIndex
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: {
        selected: selectedOption,
        correct: isCorrect
      }
    }))

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setAnswers({})
    setQuizCompleted(false)
  }

  if (quizCompleted) {
    const percentage = Math.round((score / totalQuestions) * 100)

    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Complete! 🎉</h2>

        <div className="space-y-4 mb-8">
          <div className="text-4xl font-bold text-gray-800">
            {score} / {totalQuestions}
          </div>
          <div className={`text-xl font-semibold ${
            percentage >= 80 ? 'text-green-600' :
            percentage >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {percentage}%
          </div>
          <p className="text-gray-600">
            {percentage >= 80 ? 'Excellent work! 🚀' :
             percentage >= 60 ? 'Good job! 👍' :
             'Keep practicing! 💪'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Take Quiz Again</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Practice Quiz</h2>
            <p className="text-sm text-gray-600">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">{score}</div>
            <div className="text-xs text-gray-600">Score</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question */}
      <div className="relative">
        <McqCard
          mcq={currentMcq}
          showAnswer={answers[currentIndex] !== undefined}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
              currentIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary-600 hover:bg-primary-50'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextQuestion}
            className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            <span>
              {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
