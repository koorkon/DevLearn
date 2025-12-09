// src/App.jsx
import React, { useState } from 'react'
import FileSummary from './components/FileSummary'
import Flashcard from './components/Flashcards'
import MCQGenerator from './components/McqGenerator'

function App() {
  const [activeView, setActiveView] = useState('file')

  const views = {
    file: { 
      component: FileSummary, 
      title: 'AI File Summary', 
      description: 'Upload documents and get intelligent AI-powered summaries instantly',
      color: 'from-blue-500 to-cyan-400',
      icon: '📄'
    },
    flashcards: { 
      component: Flashcard, 
      title: 'Smart Flashcards', 
      description: 'Create and master topics with AI-generated flashcards',
      color: 'from-purple-500 to-pink-500',
      icon: '🎴'
    },
    mcq: { 
      component: MCQGenerator, 
      title: 'MCQ Generator', 
      description: 'Generate practice questions and test your knowledge with AI',
      color: 'from-green-500 to-emerald-400',
      icon: '❓'
    }
  }

  const CurrentComponent = views[activeView].component

  return (
    <div className="min-h-screen vite-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/10 glass-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue hover-lift">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-glow">
                  DevLearn
                </h1>
                <p className="text-sm text-gray-400">AI Learning Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-2 glass-dark rounded-xl p-1 border border-white/10">
              {Object.entries(views).map(([key, view]) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 hover-lift ${
                    activeView === key
                      ? `bg-gradient-to-r ${view.color} text-white shadow-lg glow-blue`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{view.icon}</span>
                  <span>{view.title.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Equal Columns */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 glass-dark rounded-2xl px-6 py-3 border border-white/10 mb-6 hover-lift">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse glow-blue"></div>
              <span className="text-blue-300 text-lg font-medium">Next Generation Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-glow">
                {views[activeView].title}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {views[activeView].description}
            </p>
          </div>

          {/* 3 Equal Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* File Summary Box */}
            <div 
              className={`glass-dark rounded-2xl border border-white/10 p-6 cursor-pointer transition-all duration-300 hover-lift ${
                activeView === 'file' ? 'ring-2 ring-blue-500' : 'hover:border-blue-500/50'
              }`}
              onClick={() => setActiveView('file')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">File Summary</h3>
                  <p className="text-gray-400 text-sm">AI-powered document analysis</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Upload any document and get instant AI-powered summaries and insights
              </p>
            </div>

            {/* Flashcards Box */}
            <div 
              className={`glass-dark rounded-2xl border border-white/10 p-6 cursor-pointer transition-all duration-300 hover-lift ${
                activeView === 'flashcards' ? 'ring-2 ring-purple-500' : 'hover:border-purple-500/50'
              }`}
              onClick={() => setActiveView('flashcards')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎴</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Flashcards</h3>
                  <p className="text-gray-400 text-sm">AI-generated study cards</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Create and study with intelligent flashcards powered by advanced AI
              </p>
            </div>

            {/* MCQ Generator Box */}
            <div 
              className={`glass-dark rounded-2xl border border-white/10 p-6 cursor-pointer transition-all duration-300 hover-lift ${
                activeView === 'mcq' ? 'ring-2 ring-green-500' : 'hover:border-green-500/50'
              }`}
              onClick={() => setActiveView('mcq')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">MCQ Generator</h3>
                  <p className="text-gray-400 text-sm">AI practice questions</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Generate practice questions and test your knowledge with AI assessment
              </p>
            </div>
          </div>

          {/* Active Component Area */}
          <div className="glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <CurrentComponent />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 glass-dark py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">DevLearn</h3>
          </div>
          <p className="text-gray-400">
            Built with modern technologies for modern learning
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App