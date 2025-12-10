import { create } from "zustand";

// !!! ЦЕЙ БЛОК Є КРИТИЧНО ВАЖЛИВИМ ДЛЯ ВІДОБРАЖЕННЯ !!!
const transformDeck = (deck) => ({
    // Приведення ID до числа, оскільки PostgreSQL повертає його як рядок.
    ...deck,
    id: Number(deck.id) || deck.id, 
});

export const useStore = create((set, get) => ({
  decks: [],
  isLoading: true,

  // 1. ЗАВАНТАЖЕННЯ (GET)
  loadDecks: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/decks");
      if (!response.ok) throw new Error("Failed to fetch decks");
      
      const cloudDecks = await response.json();
      
      // *** ЗАСТОСУВАННЯ ТРАНСФОРМАЦІЇ ***
      const transformedDecks = cloudDecks.map(transformDeck);
      
      set({ decks: transformedDecks, isLoading: false });
    } catch (error) {
      console.error("Error loading decks from cloud:", error);
      set({ isLoading: false });
    }
  },

  // 2. ДОДАВАННЯ (POST)
  addDeck: async (deck) => {
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });
      if (!response.ok) throw new Error("Failed to add deck");
      
      const newDeck = await response.json();
      
      // *** ЗАСТОСУВАННЯ ТРАНСФОРМАЦІЇ ***
      const finalDeck = transformDeck(newDeck);

      set((state) => ({
        decks: [...state.decks, finalDeck],
      }));
    } catch (error) {
      console.error("Error adding deck:", error);
      throw error;
    }
  },

  // ... (Ваші функції deleteDeck та updateDeck також тепер використовують коректні ID для порівняння)

  // 3. ВИДАЛЕННЯ (DELETE)
  deleteDeck: async (id) => {
    try {
      const response = await fetch(`/api/decks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete deck");

      set((state) => ({
        decks: state.decks.filter((d) => d.id !== id), 
      }));
    } catch (error) {
      console.error("Error deleting deck:", error);
      throw error;
    }
  },

  // 4. ОНОВЛЕННЯ (PUT)
  updateDeck: async (id, updatedDeck) => {
    try {
      const response = await fetch(`/api/decks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDeck),
      });
      if (!response.ok) throw new Error("Failed to update deck");
      
      const updatedDeckData = await response.json();

      // *** ЗАСТОСУВАННЯ ТРАНСФОРМАЦІЇ ***
      const finalDeck = transformDeck(updatedDeckData);

      set((state) => ({
        decks: state.decks.map((d) => (d.id === id ? finalDeck : d)), 
      }));
    } catch (error) {
      console.error("Error updating deck:", error);
      throw error;
    }
  },
