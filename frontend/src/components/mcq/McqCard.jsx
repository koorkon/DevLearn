import React, { useState } from 'react'
import { Check, X, HelpCircle, Lightbulb } from 'lucide-react'

export default function McqCard({ mcq, showAnswer = false }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(showAnswer)

  const handleOptionSelect = (index) => {
    if (!showExplanation) {
      setSelectedOption(index)
      setShowExplanation(true)
    }
  }

  const isCorrect = selectedOption === mcq.correctOptionIndex

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 card-hover">
      {/* Question */}
      <div className="flex items-start space-x-3 mb-6">
        <div className="bg-pastel-yellow p-2 rounded-lg flex-shrink-0">
          <HelpCircle className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg mb-2">
            {mcq.question}
          </h3>
          <p className="text-sm text-gray-600">
            From: {mcq.documentName}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {mcq.options.map((option, index) => {
          const isSelected = selectedOption === index
          const isCorrectOption = index === mcq.correctOptionIndex
          const showCorrect = showExplanation && isCorrectOption
          const showIncorrect = showExplanation && isSelected && !isCorrectOption

          let optionStyle = "border-gray-200 hover:border-primary-300 hover:bg-primary-25"
          if (showCorrect) {
            optionStyle = "border-green-200 bg-green-50"
          } else if (showIncorrect) {
            optionStyle = "border-red-200 bg-red-50"
          } else if (isSelected) {
            optionStyle = "border-primary-300 bg-primary-50"
          }

          return (
            <div
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${optionStyle} ${
                !showExplanation ? 'hover:scale-[1.02]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    showCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : showIncorrect
                      ? 'border-red-500 bg-red-500 text-white'
                      : isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`font-medium ${
                    showCorrect ? 'text-green-800' :
                    showIncorrect ? 'text-red-800' :
                    'text-gray-800'
                  }`}>
                    {option.text}
                  </span>
                </div>

                {showExplanation && (
                  <>
                    {showCorrect && (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {showIncorrect && (
                      <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-pastel-green rounded-xl p-4 border border-green-200">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Explanation</h4>
              <p className="text-green-700 text-sm leading-relaxed">
                {mcq.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showExplanation && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className={`text-sm font-medium ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}>
            {selectedOption !== null
              ? isCorrect ? 'Correct! 🎉' : 'Incorrect, try again!'
              : 'Select an option to check your answer'
            }
          </div>

          <button
            onClick={() => {
              setSelectedOption(null)
              setShowExplanation(false)
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
