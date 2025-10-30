import React, { useState } from 'react'
import { Search, Filter, SortAsc } from 'lucide-react'
import SummaryCard from './SummaryCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function SummaryList({ summaries, loading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredSummaries = summaries.filter(summary =>
    summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading summaries..." />
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
            placeholder="Search summaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Sort & Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
            <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {sortedSummaries.length} of {summaries.length} summaries
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Summaries Grid */}
      {sortedSummaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-pastel-purple rounded-2xl p-8 max-w-md mx-auto">
            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No summaries found</h3>
            <p className="text-gray-600 text-sm">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Upload a document to generate your first summary'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {sortedSummaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}
    </div>
  )
}
