import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

const StudyMatch = () => {
  const { deckId } = useParams();
  const deck = useStore(state => state.decks.find(d => d.id === deckId));
  
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (deck) {
      const gameItems = [
        ...deck.cards.map(c => ({ id: c.id, content: c.term, type: 'term' })),
        ...deck.cards.map(c => ({ id: c.id, content: c.definition, type: 'def' }))
      ].sort(() => 0.5 - Math.random());
      setItems(gameItems);
    }
  }, [deck]);

  useEffect(() => {
    let interval;
    if (!isWon) interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const handleCardClick = (item, index) => {
    if (matched.includes(item.id) || selected.length === 2) return;
    
    if (selected.some(s => s.index === index)) {
        setSelected([]);
        return;
    }

    const newSelected = [...selected, { ...item, index }];
    setSelected(newSelected);

    if (newSelected.length === 2) {
        const [first, second] = newSelected;
        if (first.id === second.id && first.type !== second.type) {
            setMatched(prev => [...prev, first.id]);
            setSelected([]);
            if (matched.length + 1 === deck.cards.length) setIsWon(true);
        } else {
            setTimeout(() => setSelected([]), 1000);
        }
    }
  };

  if (!deck) return <div>...</div>;

  if (isWon) {
     return (
        <div className="flex flex-col items-center justify-center py-20">
             <h2 className="text-4xl font-bold text-green-600 mb-4">Перемога!</h2>
             <p className="text-xl mb-6">Ваш час: {time} сек</p>
             <button onClick={() => window.location.reload()} className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg">Грати знову</button>
        </div>
     )
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Знайди відповідності</h2>
            <div className="text-indigo-600 font-mono text-xl">{time}s</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, idx) => {
                const isSelected = selected.some(s => s.index === idx);
                const isMatched = matched.includes(item.id);
                const isWrong = isSelected && selected.length === 2 && selected[0].id !== selected[1].id;

                if (isMatched) return <div key={idx} className="h-24 md:h-32"></div>;

                return (
                    <button
                        key={idx}
                        onClick={() => handleCardClick(item, idx)}
                        className={clsx(
                            "h-24 md:h-32 p-4 rounded-xl border-2 shadow-sm text-sm md:text-base flex items-center justify-center transition-all duration-200 break-words w-full",
                            isSelected ? "border-indigo-500 bg-indigo-50 transform scale-105" : "border-gray-200 bg-white hover:border-indigo-200",
                            isWrong && "border-red-500 bg-red-50 animate-pulse"
                        )}
                    >
                        {item.content}
                    </button>
                );
            })}
        </div>
    </div>
  );
};
export default StudyMatch;