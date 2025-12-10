import React, { useState, useEffect } from 'react'
import { Plus, HelpCircle, Target, TrendingUp, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import McqList from '../components/mcq/McqList'
import McqQuiz from '../components/mcq/McqQuiz'
import { useApp } from '../context/AppContext'
import { mcqService } from '../services/mcqService'

export default function McqPage() {
  const { state, dispatch } = useApp()
  const [activeView, setActiveView] = useState('list') // 'list' or 'quiz'
  const [generating, setGenerating] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])

  useEffect(() => {
    loadMCQs()
  }, [])

  const loadMCQs = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      // In a real app, this would fetch from your API
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load questions' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateSampleMCQs = async () => {
    if (!state.currentDocument) {
      dispatch({ type: 'SET_ERROR', payload: 'Please upload a document first' })
      return
    }

    try {
      setGenerating(true)
      const mcqs = await mcqService.generateMCQs(
        state.currentDocument.id || 1,
        5,
        'medium'
      )
      dispatch({ type: 'ADD_MCQS', payload: mcqs })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate questions' })
    } finally {
      setGenerating(false)
    }
  }

  const startQuiz = () => {
    if (state.mcqs.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No questions available for quiz' })
      return
    }
    setQuizQuestions(state.mcqs.slice(0, 10)) // Take first 10 questions for quiz
    setActiveView('quiz')
  }

  const stats = {
    total: state.mcqs.length,
    accuracy: 85, // This would be calculated from user responses
    avgTime: '45s',
    documents: new Set(state.mcqs.map(mcq => mcq.documentName)).size
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Practice Questions</h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge with AI-generated multiple choice questions
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {state.uploadedFiles.length > 0 && activeView === 'list' && (
            <button
              onClick={generateSampleMCQs}
              disabled={generating}
              className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>
                {generating ? 'Generating...' : 'New Questions'}
              </span>
            </button>
          )}

          {state.mcqs.length > 0 && activeView === 'list' && (
            <button
              onClick={startQuiz}
              className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              <Target className="h-5 w-5" />
              <span>Start Quiz</span>
            </button>
          )}

          {activeView === 'quiz' && (
            <button
              onClick={() => setActiveView('list')}
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              <span>Back to List</span>
            </button>
          )}

          <Link
            to="/upload"
            className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-25 transition-all"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {activeView === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.accuracy}%
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
                <p className="text-sm text-gray-600 font-medium">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.avgTime}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Documents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.documents}
                </p>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl">
                <Target className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {state.mcqs.length === 0 && !state.loading && activeView === 'list' && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-pastel-green w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                No questions yet
              </h3>
              <p className="text-gray-600">
                Upload a document to generate your first practice questions
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
      {activeView === 'list' && state.mcqs.length > 0 && (
        <McqList mcqs={state.mcqs} loading={state.loading} />
      )}

      {activeView === 'quiz' && (
        <McqQuiz mcqs={quizQuestions} />
      )}
    </div>
  )
}
