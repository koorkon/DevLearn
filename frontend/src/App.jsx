<<<<<<< HEAD
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { AppProvider } from './context/AppContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import SummaryPage from './pages/SummaryPage'
import McqPage from './pages/McqPage'
import FlashcardPage from './pages/FlashcardPage'
import NotFound from './pages/NotFound'
=======
import React, { useState } from 'react'
import FileSummary from './components/FileSummary'
import Flashcard from './components/Flashcards'
import MCQGenerator from './components/MCQGenerator'
>>>>>>> feature/UI

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
<<<<<<< HEAD
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-pink">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/summaries" element={<SummaryPage />} />
            <Route path="/mcqs" element={<McqPage />} />
            <Route path="/flashcards" element={<FlashcardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
      </div>
    </AppProvider>
=======
    <div className="relative min-h-screen overflow-hidden vite-gradient">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 rounded-full w-96 h-96 bg-blue-500/5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 rounded-full w-96 h-96 bg-purple-500/5 blur-3xl animate-pulse"></div>
      <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-cyan-500/5 blur-3xl"></div>
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/10 glass-dark">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 glow-blue hover-lift">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-glow">
                  DevLearn
                </h1>
                <p className="text-sm text-gray-400">AI Learning Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex p-1 space-x-2 border glass-dark rounded-xl border-white/10">
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
        <div className="px-6 py-8 mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 space-x-3 border glass-dark rounded-2xl border-white/10 hover-lift">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse glow-blue"></div>
              <span className="text-lg font-medium text-blue-300">Next Generation Learning</span>
            </div>
            
            <h1 className="mb-4 text-5xl font-bold leading-tight text-white md:text-6xl">
              <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-glow">
                {views[activeView].title}
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-300">
              {views[activeView].description}
            </p>
          </div>

          {/* 3 Equal Columns */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
            {/* File Summary Box */}
            <div 
              className={`glass-dark rounded-2xl border border-white/10 p-6 cursor-pointer transition-all duration-300 hover-lift ${
                activeView === 'file' ? 'ring-2 ring-blue-500' : 'hover:border-blue-500/50'
              }`}
              onClick={() => setActiveView('file')}
            >
              <div className="flex items-center mb-4 space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">File Summary</h3>
                  <p className="text-sm text-gray-400">AI-powered document analysis</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
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
              <div className="flex items-center mb-4 space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <span className="text-2xl">🎴</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Flashcards</h3>
                  <p className="text-sm text-gray-400">AI-generated study cards</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
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
              <div className="flex items-center mb-4 space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-400">
                  <span className="text-2xl">❓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">MCQ Generator</h3>
                  <p className="text-sm text-gray-400">AI practice questions</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Generate practice questions and test your knowledge with AI assessment
              </p>
            </div>
          </div>

          {/* Active Component Area */}
          <div className="overflow-hidden border shadow-2xl glass-dark rounded-2xl border-white/10">
            <CurrentComponent />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 mt-12 border-t border-white/10 glass-dark">
        <div className="px-6 mx-auto text-center max-w-7xl">
          <div className="flex items-center justify-center mb-4 space-x-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
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
>>>>>>> feature/UI
  )
}

export default App