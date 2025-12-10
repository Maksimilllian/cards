import React from 'react';
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
                  <Link to={`/study/${deck.id}/flashcards`} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100" title="Навчання">
                    <Play size={18} />
                  </Link>
                  <Link to={`/edit/${deck.id}`} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Редагувати">
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
export default Home;