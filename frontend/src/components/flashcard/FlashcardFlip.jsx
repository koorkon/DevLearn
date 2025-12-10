import React, { useState } from 'react'
import { RotateCcw, Check, X } from 'lucide-react'

export default function FlashcardFlip({ card, onRate, isFirst }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [rated, setRated] = useState(false)

  const handleFlip = () => {
    if (!rated) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleRate = (difficulty) => {
    setRated(true)
    onRate(difficulty)

    // Auto-flip back after rating
    setTimeout(() => {
      setIsFlipped(false)
      setRated(false)
    }, 1000)
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${isFirst ? 'animate-fade-in' : ''}`}>
      <div
        className={`flip-card w-full h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner w-full h-full">
          {/* Front - Question */}
          <div className="flip-card-front bg-white rounded-2xl shadow-xl border-2 border-primary-100 p-8 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-pastel-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-semibold text-xl">?</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {card.frontContent}
                </h3>
                <p className="text-gray-600">
                  Click to reveal answer
                </p>
              </div>
            </div>
          </div>

          {/* Back - Answer */}
          <div className="flip-card-back bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold text-xl">!</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  {card.backContent}
                </h3>
                <p className="text-primary-100">
                  Click to see question
                </p>
              </div>
            </div>

            {/* Rating Buttons */}
            {isFlipped && !rated && (
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRate('easy')
                  }}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Easy</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRate('hard')
                  }}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Hard</span>
                </button>
              </div>
            )}

            {/* Rating Feedback */}
            {rated && (
              <div className="text-center mt-6">
                <p className="text-primary-100 font-medium">
                  Rated! Moving to next card...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isFlipped && (
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Click the card to flip and reveal the answer</p>
        </div>
      )}
    </div>
  )
}
