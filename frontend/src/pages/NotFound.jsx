import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-pink">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-900 opacity-10">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-900">
              Page Not Found
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Oops! Lost your way?
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to studying!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group flex items-center space-x-3 bg-primary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/dashboard"
            className="group flex items-center space-x-3 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-25 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-8 bg-white/50 rounded-3xl backdrop-blur-sm border border-white/20">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { path: '/upload', label: 'Upload', icon: '📄' },
              { path: '/summaries', label: 'Summaries', icon: '📝' },
              { path: '/mcqs', label: 'MCQs', icon: '❓' },
              { path: '/flashcards', label: 'Flashcards', icon: '🎴' }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <div className="font-medium text-gray-900 text-sm">
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-6 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/20">
          <div className="flex items-center justify-center space-x-3 text-gray-700">
            <Search className="h-5 w-5" />
            <span className="text-sm">
              Can't find what you're looking for? Try using the search feature.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
