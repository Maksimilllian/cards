import React, { useState, useEffect } from 'react';
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
export default CreateDeck;