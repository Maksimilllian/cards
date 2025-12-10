import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Flashcard from '../components/Flashcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StudyFlashcards = () => {
  const { deckId } = useParams();
  const deck = useStore(state => state.decks.find(d => d.id === deckId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!deck) return <div>Набір не знайдено</div>;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % deck.cards.length), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + deck.cards.length) % deck.cards.length), 150);
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            <div className="flex gap-2 text-sm font-semibold">
                <Link to={`/study/${deckId}/quiz`} className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Тест</Link>
                <Link to={`/study/${deckId}/match`} className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Гра</Link>
            </div>
        </div>
      
      <div className="mb-8 h-80">
        <Flashcard 
          term={deck.cards[currentIndex].term}
          definition={deck.cards[currentIndex].definition}
          isFlipped={isFlipped}
          onClick={() => setIsFlipped(!isFlipped)}
        />
      </div>

      <div className="flex justify-center items-center gap-6">
        <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-50">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-600">
          {currentIndex + 1} / {deck.cards.length}
        </span>
        <button onClick={handleNext} className="p-3 rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-50">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
export default StudyFlashcards;