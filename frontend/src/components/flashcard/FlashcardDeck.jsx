import React, { useState } from 'react'
import { Search, Play, MoreVertical, BookOpen } from 'lucide-react'

export default function FlashcardDeck({ flashcards, onStudyDeck }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Group flashcards by document
  const decks = flashcards.reduce((acc, card) => {
    const docName = card.documentName
    if (!acc[docName]) {
      acc[docName] = []
    }
    acc[docName].push(card)
    return acc
  }, {})

  const filteredDecks = Object.entries(decks).filter(([docName, cards]) =>
    docName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search flashcard decks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Decks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDecks.map(([docName, cards]) => (
          <div
            key={docName}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 card-hover"
          >
            {/* Deck Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-pastel-purple p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {docName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cards.length} card{cards.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Sample Cards */}
            <div className="space-y-2 mb-4">
              {cards.slice(0, 3).map((card, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600"
                >
                  <div className="font-medium text-gray-800 mb-1">
                    {card.frontContent}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {card.backContent}
                  </div>
                </div>
              ))}
              {cards.length > 3 && (
                <div className="text-center text-xs text-gray-500 py-1">
                  +{cards.length - 3} more cards
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => onStudyDeck(cards)}
              className="w-full bg-primary-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Study Deck</span>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDecks.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-pastel-purple rounded-2xl p-8 max-w-md mx-auto">
            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No flashcard decks found</h3>
            <p className="text-gray-600 text-sm">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Upload a document to generate your first flashcards'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
