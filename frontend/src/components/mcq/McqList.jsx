import React, { useState } from 'react'
import { Search, Filter, Shuffle } from 'lucide-react'
import McqCard from './McqCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function McqList({ mcqs, loading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAnswers, setShowAnswers] = useState(false)
  const [shuffled, setShuffled] = useState(false)

  const filteredMcqs = mcqs.filter(mcq =>
    mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mcq.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayMcqs = shuffled
    ? [...filteredMcqs].sort(() => Math.random() - 0.5)
    : filteredMcqs

  const toggleShuffle = () => {
    setShuffled(!shuffled)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading questions..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
              shuffled
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
            }`}
          >
            <Shuffle className="h-4 w-4" />
            <span className="text-sm font-medium">Shuffle</span>
          </button>

          {/* Show Answers Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={(e) => setShowAnswers(e.target.checked)}
              className="hidden"
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${
              showAnswers ? 'bg-primary-500' : 'bg-gray-300'
            }`}>
              <div className={`bg-white w-4 h-4 rounded-full transition-transform transform ${
                showAnswers ? 'translate-x-7' : 'translate-x-1'
              } mt-1`} />
            </div>
            <span className="text-sm text-gray-700 font-medium">Show Answers</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {displayMcqs.length} question{displayMcqs.length !== 1 ? 's' : ''}
        {searchTerm && ` matching "${searchTerm}"`}
        {shuffled && ' • Shuffled'}
      </div>

      {/* MCQs Grid */}
      {displayMcqs.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-pastel-yellow rounded-2xl p-8 max-w-md mx-auto">
            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No questions found</h3>
            <p className="text-gray-600 text-sm">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Upload a document to generate your first practice questions'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayMcqs.map((mcq) => (
            <McqCard
              key={mcq.id}
              mcq={mcq}
              showAnswer={showAnswers}
            />
          ))}
        </div>
      )}
    </div>
  )
}
