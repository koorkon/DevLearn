import React, { useState, useCallback } from 'react';

const Flashcard = () => {
  const [topic, setTopic] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [masteredCards, setMasteredCards] = useState(new Set());

  const generateFlashcards = useCallback(async () => {
  if (!topic.trim()) return;
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('http://localhost:5000/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Standard JSON
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to generate');

    setFlashcards(data.flashcards.map((card, idx) => ({ ...card, id: idx })));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [topic]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && topic.trim()) {
      generateFlashcards();
    }
  };

  const toggleMastered = (index) => {
    const newMastered = new Set(masteredCards);
    if (newMastered.has(index)) {
      newMastered.delete(index);
    } else {
      newMastered.add(index);
    }
    setMasteredCards(newMastered);
  };

  if (flashcards.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto">
          <h2 className="mb-6 text-2xl font-bold text-white">Smart Flashcards</h2>
          {error && <p className="mb-4 text-red-400">{error}</p>}
          <div className="p-6 space-y-4 border glass-dark rounded-xl border-white/10">
            <input
              type="text"
              placeholder="Enter topic (e.g., Biology) + Enter"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 text-white placeholder-gray-500 border rounded-lg bg-black/30 border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={generateFlashcards}
              disabled={loading || !topic.trim()}
              className="w-full py-3 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  const masteredCount = masteredCards.size;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{topic}</h2>
          <span className="text-gray-400">
            {currentCardIndex + 1}/{flashcards.length} | Mastered: {masteredCount}
          </span>
        </div>

        <div className="w-full h-2 mb-8 rounded-full bg-white/10">
          <div
            className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>

        {/* 🚀 3D FLASHCARD FIX */}
        <div className="[perspective:1000px] w-full h-80 mb-8">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            {/* Front Face (Question) */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] glass-dark rounded-2xl border border-white/10 p-8 flex flex-col justify-center items-center text-center">
              <p className="mb-4 font-mono text-sm text-gray-400">QUESTION</p>
              <div className="text-2xl font-bold text-white">
                {/* 🚀 FIXED: Fallback to .question if .front is missing */}
                {currentCard.front || currentCard.question || "No Question Provided"}
              </div>
              {(currentCard.category || currentCard.difficulty) && (
                <span className="px-3 py-1 mt-4 text-xs text-purple-200 uppercase rounded-full bg-purple-500/30">
                  {currentCard.category || currentCard.difficulty}
                </span>
              )}
            </div>

            {/* Back Face (Answer) */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] glass-dark rounded-2xl border border-purple-500/30 p-8 flex flex-col justify-center items-center text-center bg-purple-900/20">
              <p className="mb-4 font-mono text-sm text-purple-400">ANSWER</p>
              <div className="text-2xl font-semibold text-white">
                {/* 🚀 FIXED: Fallback to .answer or .back */}
                {currentCard.back || currentCard.answer || "No Answer Provided"}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between gap-3">
          <button
            onClick={() => { setCurrentCardIndex(Math.max(0, currentCardIndex - 1)); setIsFlipped(false); }}
            disabled={currentCardIndex === 0}
            className="px-6 py-2 text-white transition-all rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            ← Previous
          </button>

          <button
            onClick={() => toggleMastered(currentCardIndex)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              masteredCards.has(currentCardIndex)
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {masteredCards.has(currentCardIndex) ? '✓ Mastered' : 'Mark as Mastered'}
          </button>

          <button
            onClick={() => { setCurrentCardIndex(Math.min(flashcards.length - 1, currentCardIndex + 1)); setIsFlipped(false); }}
            disabled={currentCardIndex === flashcards.length - 1}
            className="px-6 py-2 text-white transition-all rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        {masteredCount === flashcards.length && (
          <div className="p-6 mt-8 text-center border bg-green-500/10 rounded-xl border-green-500/20">
            <p className="mb-4 text-lg font-bold text-green-400">🎉 Mastery Achieved!</p>
            <button
              onClick={() => { setTopic(''); setFlashcards([]); }}
              className="px-8 py-3 font-bold text-white rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Try New Topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;