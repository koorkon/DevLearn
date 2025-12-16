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

function App() {
  return (
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
  )
}

export default App
