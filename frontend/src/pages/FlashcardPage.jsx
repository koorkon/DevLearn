import React, { useState, useEffect } from 'react'
import { Plus, Layers, Zap, Target, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import FlashcardDeck from '../components/flashcard/FlashcardDeck'
import FlashcardViewer from '../components/flashcard/FlashcardViewer'
import FlashcardFlip from '../components/flashcard/FlashcardFlip'
import { useApp } from '../context/AppContext'
import { flashcardService } from '../services/flashcardService'

export default function FlashcardPage() {
  const { state, dispatch } = useApp()
  const [activeView, setActiveView] = useState('decks') // 'decks', 'viewer', 'study'
  const [currentDeck, setCurrentDeck] = useState([])
  const [studyIndex, setStudyIndex] = useState(0)
  const [studyMode, setStudyMode] = useState('viewer') // 'viewer' or 'flip'
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadFlashcards()
  }, [])

  const loadFlashcards = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      // In a real app, this would fetch from your API
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load flashcards' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateSampleFlashcards = async () => {
    if (!state.currentDocument) {
      dispatch({ type: 'SET_ERROR', payload: 'Please upload a document first' })
      return
    }

    try {
      setGenerating(true)
      const flashcards = await flashcardService.generateFlashcards(
        state.currentDocument.id || 1,
        10
      )
      dispatch({ type: 'ADD_FLASHCARDS', payload: flashcards })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate flashcards' })
    } finally {
      setGenerating(false)
    }
  }

  const handleStudyDeck = (deck) => {
    setCurrentDeck(deck)
    setStudyIndex(0)
    setActiveView('viewer')
  }

  const handleStartStudySession = (deck) => {
    setCurrentDeck(deck)
    setStudyIndex(0)
    setStudyMode('flip')
    setActiveView('study')
  }

  const handleRateCard = (difficulty) => {
    // In a real app, this would update spaced repetition algorithm
    if (studyIndex < currentDeck.length - 1) {
      setStudyIndex(prev => prev + 1)
    } else {
      // End of deck
      setActiveView('decks')
    }
  }

  const stats = {
    total: state.flashcards.length,
    mastered: Math.floor(state.flashcards.length * 0.92),
    decks: new Set(state.flashcards.map(card => card.documentName)).size,
    reviews: state.flashcards.length * 3 // Simulated review count
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-600 text-lg">
            Master concepts with interactive flashcards and spaced repetition
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {state.uploadedFiles.length > 0 && activeView === 'decks' && (
            <button
              onClick={generateSampleFlashcards}
              disabled={generating}
              className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>
                {generating ? 'Generating...' : 'New Flashcards'}
              </span>
            </button>
          )}

          {activeView !== 'decks' && (
            <button
              onClick={() => setActiveView('decks')}
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Back to Decks</span>
            </button>
          )}

          <Link
            to="/upload"
            className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-25 transition-all"
          >
            <Layers className="h-5 w-5" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {activeView === 'decks' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Cards</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Mastered</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.mastered}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Decks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.decks}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Reviews</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.reviews}
                </p>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl">
                <RotateCcw className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {state.flashcards.length === 0 && !state.loading && activeView === 'decks' && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-pastel-purple w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
              <Layers className="h-10 w-10 text-purple-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                No flashcards yet
              </h3>
              <p className="text-gray-600">
                Upload a document to generate your first flashcard deck
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Upload First Document</span>
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {activeView === 'decks' && state.flashcards.length > 0 && (
        <FlashcardDeck
          flashcards={state.flashcards}
          onStudyDeck={handleStudyDeck}
        />
      )}

      {activeView === 'viewer' && currentDeck.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Flashcard Viewer
            </h2>
            <button
              onClick={() => handleStartStudySession(currentDeck)}
              className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              <Zap className="h-5 w-5" />
              <span>Start Study Session</span>
            </button>
          </div>
          <FlashcardViewer flashcards={currentDeck} />
        </div>
      )}

      {activeView === 'study' && currentDeck.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Study Session
            </h2>
            <p className="text-gray-600">
              Card {studyIndex + 1} of {currentDeck.length}
            </p>
          </div>
          <FlashcardFlip
            card={currentDeck[studyIndex]}
            onRate={handleRateCard}
            isFirst={studyIndex === 0}
          />
        </div>
      )}
    </div>
  )
}
