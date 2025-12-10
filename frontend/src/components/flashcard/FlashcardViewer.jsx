import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw } from 'lucide-react'

export default function FlashcardViewer({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shuffled, setShuffled] = useState(false)
  const [displayCards, setDisplayCards] = useState(flashcards)

  useEffect(() => {
    setDisplayCards(shuffled ? [...flashcards].sort(() => Math.random() - 0.5) : flashcards)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [flashcards, shuffled])

  const currentCard = displayCards[currentIndex]

  const nextCard = () => {
    if (currentIndex < displayCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const toggleShuffle = () => {
    setShuffled(!shuffled)
  }

  const resetDeck = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setShuffled(false)
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No flashcards available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Card {currentIndex + 1} of {displayCards.length}
          {shuffled && ' • Shuffled'}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              shuffled
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
            }`}
            title="Shuffle cards"
          >
            <Shuffle className="h-4 w-4" />
          </button>

          <button
            onClick={resetDeck}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Reset deck"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div
          className={`flip-card w-full max-w-2xl h-64 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flip-card-inner w-full h-full">
            {/* Front */}
            <div className="flip-card-front bg-white rounded-2xl shadow-lg border-2 border-primary-100 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-pastel-blue w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-semibold">?</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {currentCard.frontContent}
                </h3>
                <p className="text-gray-600 text-sm">
                  Click to reveal answer
                </p>
              </div>
            </div>

            {/* Back */}
            <div className="flip-card-back bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-8 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold">!</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {currentCard.backContent}
                </h3>
                <p className="text-primary-100 text-sm">
                  Click to see question
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className={`p-3 rounded-xl transition-all ${
            currentIndex === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-primary-600 hover:bg-primary-50'
          }`}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextCard}
          disabled={currentIndex === displayCards.length - 1}
          className={`p-3 rounded-xl transition-all ${
            currentIndex === displayCards.length - 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-primary-600 hover:bg-primary-50'
          }`}
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex justify-center">
        <div className="flex space-x-1">
          {displayCards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-primary-500'
                  : index < currentIndex
                  ? 'bg-primary-300'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
