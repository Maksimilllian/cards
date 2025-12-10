const fs = require('fs');
const path = require('path');

// --- 1. Визначення вмісту файлів ---

const packageJson = {
  "name": "flashlearn",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.0",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "tailwind-merge": "^2.2.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.4"
  }
};

const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
    },
  },
  plugins: [],
}`;

const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FlashLearn</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
}

body {
  @apply bg-gray-50 text-gray-900;
}`;

const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

const appJsx = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateDeck from './pages/CreateDeck';
import StudyFlashcards from './pages/StudyFlashcards';
import StudyQuiz from './pages/StudyQuiz';
import StudyMatch from './pages/StudyMatch';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/edit/:id" element={<CreateDeck />} />
          <Route path="/study/:deckId/flashcards" element={<StudyFlashcards />} />
          <Route path="/study/:deckId/quiz" element={<StudyQuiz />} />
          <Route path="/study/:deckId/match" element={<StudyMatch />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;`;

const useStoreJs = `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create(
  persist(
    (set) => ({
      decks: [
        {
          id: 'demo-1',
          title: 'Основи React',
          description: 'Базові терміни та поняття бібліотеки React',
          cards: [
            { id: 'c1', term: 'Component', definition: 'Незалежний, придатний для повторного використання шматок UI.' },
            { id: 'c2', term: 'Props', definition: 'Вхідні дані, які передаються компоненту батьком (read-only).' },
            { id: 'c3', term: 'State', definition: 'Об\\'єкт, що містить дані, які можуть змінюватися протягом життя компонента.' },
            { id: 'c4', term: 'Hook', definition: 'Функція, яка дозволяє використовувати стан та інші можливості React без написання класу.' },
          ],
        },
      ],
      addDeck: (deck) => set((state) => ({ 
        decks: [...state.decks, { ...deck, id: generateId() }] 
      })),
      deleteDeck: (id) => set((state) => ({ 
        decks: state.decks.filter((d) => d.id !== id) 
      })),
      updateDeck: (id, updatedDeck) => set((state) => ({
        decks: state.decks.map((d) => (d.id === id ? { ...d, ...updatedDeck } : d)),
      })),
    }),
    {
      name: 'flashcards-storage',
    }
  )
);`;

const layoutJsx = `import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Layers className="w-6 h-6" />
            <span>FlashLearn</span>
          </Link>
          <nav>
            <Link to="/create" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
              + Створити набір
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        FlashLearn © 2025
      </footer>
    </div>
  );
};
export default Layout;`;

const flashcardJsx = `import React from 'react';
import clsx from 'clsx';

const Flashcard = ({ term, definition, isFlipped, onClick }) => {
  return (
    <div 
      className="w-full max-w-2xl h-80 cursor-pointer perspective-1000 mx-auto"
      onClick={onClick}
    >
      <div 
        className={clsx(
          "relative w-full h-full text-center transition-transform duration-500 transform-style-3d preserve-3d shadow-xl rounded-xl",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        <div className="absolute w-full h-full backface-hidden bg-white rounded-xl flex items-center justify-center p-8 border-2 border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800">{term}</h2>
          <span className="absolute bottom-4 text-gray-400 text-sm uppercase tracking-widest">Термін</span>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-indigo-50 rounded-xl flex items-center justify-center p-8 border-2 border-indigo-100 rotate-y-180">
          <p className="text-xl text-gray-700 leading-relaxed">{definition}</p>
          <span className="absolute bottom-4 text-indigo-400 text-sm uppercase tracking-widest">Визначення</span>
        </div>
      </div>
    </div>
  );
};
export default Flashcard;`;

const homeJsx = `import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Play, Edit, Trash2 } from 'lucide-react';

const Home = () => {
  const { decks, deleteDeck } = useStore();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Ваші набори</h1>
      {decks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">У вас ще немає наборів карток.</p>
          <Link to="/create" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">
            Створити перший набір
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div key={deck.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{deck.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{deck.description}</p>
                <div className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded inline-block text-gray-600">
                  {deck.cards.length} карток
                </div>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Link to={\`/study/\${deck.id}/flashcards\`} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100" title="Навчання">
                    <Play size={18} />
                  </Link>
                  <Link to={\`/edit/\${deck.id}\`} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Редагувати">
                    <Edit size={18} />
                  </Link>
                </div>
                <button 
                  onClick={() => deleteDeck(deck.id)} 
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Home;`;

const createDeckJsx = `import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Plus, X, Save } from 'lucide-react';

const CreateDeck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { decks, addDeck, updateDeck } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([{ id: Date.now(), term: '', definition: '' }]);

  useEffect(() => {
    if (id) {
      const deckToEdit = decks.find(d => d.id === id);
      if (deckToEdit) {
        setTitle(deckToEdit.title);
        setDescription(deckToEdit.description);
        setCards(deckToEdit.cards);
      }
    }
  }, [id, decks]);

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { id: Date.now() + Math.random(), term: '', definition: '' }]);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!title.trim()) return alert('Введіть назву набору');
    const validCards = cards.filter(c => c.term.trim() && c.definition.trim());
    if (validCards.length === 0) return alert('Додайте хоча б одну заповнену картку');

    const deckData = { title, description, cards: validCards };
    if (id) {
      updateDeck(id, deckData);
    } else {
      addDeck(deckData);
    }
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{id ? 'Редагувати набір' : 'Створити новий набір'}</h1>
        <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
          <Save size={18} /> Зберегти
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <input 
          className="w-full text-xl font-bold border-b-2 border-gray-200 focus:border-indigo-500 outline-none py-2 mb-4" 
          placeholder='Назва, напр. "Біологія: Клітина"'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea 
          className="w-full text-gray-600 border rounded-lg p-3 focus:border-indigo-500 outline-none" 
          placeholder="Опис набору..."
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-start group">
            <span className="text-gray-400 font-bold mt-3 w-6">{index + 1}</span>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 uppercase font-bold mb-1">Термін</label>
                <input 
                  className="border-b-2 border-gray-200 focus:border-indigo-500 outline-none py-1 bg-transparent"
                  value={card.term}
                  onChange={(e) => handleCardChange(index, 'term', e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 uppercase font-bold mb-1">Визначення</label>
                <input 
                  className="border-b-2 border-gray-200 focus:border-indigo-500 outline-none py-1 bg-transparent"
                  value={card.definition}
                  onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={() => removeCard(index)} 
              className="text-gray-300 hover:text-red-500 mt-2 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addCard} className="w-full py-4 mt-6 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-500 transition flex justify-center items-center gap-2">
        <Plus size={20} /> Додати картку
      </button>
    </div>
  );
};
export default CreateDeck;`;

const studyFlashcardsJsx = `import React, { useState } from 'react';
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
                <Link to={\`/study/\${deckId}/quiz\`} className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Тест</Link>
                <Link to={\`/study/\${deckId}/match\`} className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Гра</Link>
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
export default StudyFlashcards;`;

const studyQuizJsx = `import React, { useState, useMemo } from 'react';
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
                <Link to={\`/study/\${deckId}/flashcards\`} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg">Назад</Link>
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
export default StudyQuiz;`;

const studyMatchJsx = `import React, { useState, useEffect } from 'react';
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
export default StudyMatch;`;

const files = {
  'package.json': JSON.stringify(packageJson, null, 2),
  'vite.config.js': viteConfig,
  'tailwind.config.js': tailwindConfig,
  'postcss.config.js': postcssConfig,
  'index.html': indexHtml,
  'src/index.css': indexCss,
  'src/main.jsx': mainJsx,
  'src/App.jsx': appJsx,
  'src/store/useStore.js': useStoreJs,
  'src/components/Layout.jsx': layoutJsx,
  'src/components/Flashcard.jsx': flashcardJsx,
  'src/pages/Home.jsx': homeJsx,
  'src/pages/CreateDeck.jsx': createDeckJsx,
  'src/pages/StudyFlashcards.jsx': studyFlashcardsJsx,
  'src/pages/StudyQuiz.jsx': studyQuizJsx,
  'src/pages/StudyMatch.jsx': studyMatchJsx
};

// --- 2. Генерація файлів ---

console.log('🚀 Починаємо створення проєкту FlashLearn...');

// Створення папок та файлів
Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Створено: ${filePath}`);
});

console.log('\\n🎉 Готово! Проєкт створено успішно.');
console.log('👉 Тепер виконайте наступні команди:');
console.log('   npm install');
console.log('   npm run dev');