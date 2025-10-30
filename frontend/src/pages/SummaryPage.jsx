import React, { useState, useEffect } from 'react'
import { Plus, BookOpen, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import SummaryList from '../components/summary/SummaryList'
import { useApp } from '../context/AppContext'
import { summaryService } from '../services/summaryService'

export default function SummaryPage() {
  const { state, dispatch } = useApp()
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // Load summaries on component mount
    loadSummaries()
  }, [])

  const loadSummaries = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      // In a real app, this would fetch from your API
      // For now, we'll use the context state
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load summaries' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateSampleSummary = async () => {
    if (!state.currentDocument) {
      dispatch({ type: 'SET_ERROR', payload: 'Please upload a document first' })
      return
    }

    try {
      setGenerating(true)
      const summary = await summaryService.generateSummary(
        state.currentDocument.id || 1,
        'detailed'
      )
      dispatch({ type: 'ADD_SUMMARY', payload: summary })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate summary' })
    } finally {
      setGenerating(false)
    }
  }

  const stats = {
    total: state.summaries.length,
    readingTime: state.summaries.reduce((total, summary) =>
      total + Math.ceil(summary.content.split(' ').length / 200), 0
    ),
    documents: new Set(state.summaries.map(s => s.documentName)).size
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Study Summaries</h1>
          <p className="text-gray-600 text-lg">
            AI-generated summaries of your study materials
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {state.uploadedFiles.length > 0 && (
            <button
              onClick={generateSampleSummary}
              disabled={generating}
              className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>
                {generating ? 'Generating...' : 'New Summary'}
              </span>
            </button>
          )}
          <Link
            to="/upload"
            className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-25 transition-all"
          >
            <BookOpen className="h-5 w-5" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Summaries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Reading Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.readingTime} min
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Documents Covered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.documents}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {state.summaries.length === 0 && !state.loading && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-pastel-blue w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="h-10 w-10 text-primary-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                No summaries yet
              </h3>
              <p className="text-gray-600">
                Upload a document to generate your first AI-powered summary
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

      {/* Summaries List */}
      {state.summaries.length > 0 && (
        <SummaryList summaries={state.summaries} loading={state.loading} />
      )}
    </div>
  )
}
