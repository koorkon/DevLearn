import React, { useState, useCallback } from 'react';

const Flashcard = () => {
  const [topic, setTopic] = useState('');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate');

      const cardsWithIds = data.flashcards.map((card, idx) => ({
        ...card,
        id: idx
      }));

      setFlashcards(cardsWithIds);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setMasteredCards(new Set());
    } catch (err) {
      console.error(err);
      setError('Failed to generate cards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

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
          <h2 className="text-2xl font-bold text-white mb-6">Smart Flashcards</h2>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <div className="glass-dark rounded-xl p-6 border border-white/10 space-y-4">
            <input
              type="text"
              placeholder="Enter topic (e.g., Biology)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black/30 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
            />
            <button
              onClick={generateFlashcards}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  const filteredCards = flashcards.filter((_, idx) => !masteredCards.has(idx));
  const masteredCount = masteredCards.size;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{topic}</h2>
          <span className="text-gray-400">
            {currentCardIndex + 1}/{flashcards.length} | Mastered: {masteredCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="glass-dark rounded-2xl border border-white/10 p-8 min-h-64 cursor-pointer flex flex-col justify-center items-center text-center mb-8 transition-all hover:shadow-lg"
        >
          <p className="text-sm text-gray-400 mb-4">
            {isFlipped ? 'Answer' : 'Question'} • Click to flip
          </p>
          <div className="text-2xl font-bold text-white mb-4">
            {isFlipped ? currentCard.back : currentCard.front}
          </div>
          {currentCard.category && (
            <span className="text-xs bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full">
              {currentCard.category}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-between">
          <button
            onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
            disabled={currentCardIndex === 0}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 transition-all"
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
            onClick={() => setCurrentCardIndex(Math.min(flashcards.length - 1, currentCardIndex + 1))}
            disabled={currentCardIndex === flashcards.length - 1}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 transition-all"
          >
            Next →
          </button>
        </div>

        {/* Reset Button */}
        {filteredCards.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-green-400 text-lg font-bold mb-4">🎉 All cards mastered!</p>
            <button
              onClick={() => {
                setTopic('');
                setFlashcards([]);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg"
            >
              Try Another Topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;