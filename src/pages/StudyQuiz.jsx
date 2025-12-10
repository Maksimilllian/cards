import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const StudyQuiz = () => {
  const { deckId } = useParams();
  const deck = useStore(state => state.decks.find(d => d.id === deckId));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = useMemo(() => {
    if (!deck) return [];
    return deck.cards.map(card => {
        const others = deck.cards.filter(c => c.id !== card.id);
        const wrongAnswers = others.sort(() => 0.5 - Math.random()).slice(0, 3).map(c => c.definition);
        const options = [...wrongAnswers, card.definition].sort(() => 0.5 - Math.random());
        return {
            term: card.term,
            correct: card.definition,
            options
        };
    }).sort(() => 0.5 - Math.random());
  }, [deck]);

  if (!deck) return <div>Набір не знайдено</div>;
  if (deck.cards.length < 4) return <div className="text-center mt-10">Для тесту потрібно мінімум 4 картки.</div>;

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const isCorrect = option === questions[currentQIndex].correct;
    
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    }, 1000);
  };

  if (showResult) {
    return (
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-lg mt-10">
            <h2 className="text-3xl font-bold mb-4">Результат</h2>
            <div className="text-6xl font-black text-indigo-600 mb-4">
                {Math.round((score / questions.length) * 100)}%
            </div>
            <p className="text-gray-500 mb-6">Правильно: {score} з {questions.length}</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Спробувати ще</button>
                <Link to={`/study/${deckId}/flashcards`} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg">Назад</Link>
            </div>
        </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between text-sm font-medium text-gray-500">
            <span>Питання {currentQIndex + 1} з {questions.length}</span>
            <span>Рахунок: {score}</span>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{currentQ.term}</h2>
            <p className="text-gray-400 text-sm uppercase">Оберіть правильне визначення</p>
        </div>

        <div className="grid gap-3">
            {currentQ.options.map((opt, idx) => {
                let btnClass = "bg-white p-4 rounded-lg shadow-sm border-2 border-transparent hover:border-indigo-200 text-left transition";
                if (selectedOption) {
                    if (opt === currentQ.correct) btnClass = "bg-green-100 border-green-500 text-green-800";
                    else if (opt === selectedOption) btnClass = "bg-red-100 border-red-500 text-red-800";
                    else btnClass = "bg-gray-100 opacity-50";
                }

                return (
                    <button 
                        key={idx} 
                        disabled={!!selectedOption}
                        onClick={() => handleAnswer(opt)}
                        className={btnClass}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    </div>
  );
};
export default StudyQuiz;