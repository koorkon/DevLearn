import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, HelpCircle, Cards, Upload, TrendingUp, Clock, Target, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Dashboard() {
  const { state } = useApp()
  const [recentActivity, setRecentActivity] = useState([])
  const [stats, setStats] = useState({
    documents: 0,
    summaries: 0,
    mcqs: 0,
    flashcards: 0
  })

  useEffect(() => {
    // Calculate stats from state
    const newStats = {
      documents: state.uploadedFiles.length,
      summaries: state.summaries.length,
      mcqs: state.mcqs.length,
      flashcards: state.flashcards.length
    }
    setStats(newStats)

    // Generate recent activity
    const activity = [
      ...state.uploadedFiles.map(file => ({
        type: 'upload',
        title: `Uploaded ${file.originalFilename}`,
        time: 'Just now',
        icon: Upload,
        color: 'blue'
      })),
      ...state.summaries.slice(0, 2).map(summary => ({
        type: 'summary',
        title: `Created summary: ${summary.title}`,
        time: '2 hours ago',
        icon: FileText,
        color: 'purple'
      })),
      ...state.mcqs.slice(0, 2).map(mcq => ({
        type: 'mcq',
        title: `Generated ${state.mcqs.length} practice questions`,
        time: '1 day ago',
        icon: HelpCircle,
        color: 'green'
      }))
    ].slice(0, 5)

    setRecentActivity(activity)
  }, [state])

  const quickActions = [
    {
      icon: Upload,
      title: 'Upload New File',
      description: 'Add PDF, PPT, or text files',
      link: '/upload',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'View Summaries',
      description: 'Browse your study summaries',
      link: '/summaries',
      color: 'purple'
    },
    {
      icon: HelpCircle,
      title: 'Practice Questions',
      description: 'Test your knowledge with MCQs',
      link: '/mcqs',
      color: 'green'
    },
    {
      icon: Cards,
      title: 'Study Flashcards',
      description: 'Review with interactive cards',
      link: '/flashcards',
      color: 'pink'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      pink: 'from-pink-500 to-pink-600'
    }
    return colors[color] || colors.blue
  }

  const getLightColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
      green: 'bg-green-50 text-green-600',
      pink: 'bg-pink-50 text-pink-600'
    }
    return colors[color] || colors.blue
  }

  if (state.loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to continue your learning journey?
            </p>
          </div>
          <Link
            to="/upload"
            className="mt-4 lg:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            + New Study Session
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.documents}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+2 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Summaries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.summaries}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>5 min avg read</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Practice Questions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.mcqs}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <HelpCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-blue-600">
            <Target className="h-4 w-4 mr-1" />
            <span>85% accuracy</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Flashcards</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.flashcards}
              </p>
            </div>
            <div className="bg-pink-50 p-3 rounded-xl">
              <Cards className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-purple-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>92% mastered</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 card-hover group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`bg-gradient-to-r ${getColorClasses(action.color)} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {action.description}
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-primary-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>No recent activity</p>
                <p className="text-sm mt-2">Upload a file to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getLightColorClasses(activity.color)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
