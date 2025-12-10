import { create } from "zustand";

// !!! КРИТИЧНО ВАЖЛИВО: Функція для приведення ID до числа. !!!
const transformDeck = (deck) => ({
    ...deck,
    id: Number(deck.id) || deck.id, 
});

export const useStore = create((set, get) => ({
  decks: [],
  isLoading: true,

  // 1. ЗАВАНТАЖЕННЯ (GET) - ТЕПЕР ПІДТЯГНЕ ВАШІ НАБОРИ
  loadDecks: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/decks");
      if (!response.ok) throw new Error("Failed to fetch decks");
      
      const cloudDecks = await response.json();
      
      // *** ЗАСТОСУВАТИ ТРАНСФОРМАЦІЮ ***
      const transformedDecks = cloudDecks.map(transformDeck);
      
      set({ decks: transformedDecks, isLoading: false });
    } catch (error) {
      console.error("Error loading decks from cloud:", error);
      set({ isLoading: false });
    }
  },

  // 2. ДОДАВАННЯ (POST) - ТЕПЕР ДОДАЄ КОРЕКТНИЙ ID
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

  // 3. ВИДАЛЕННЯ (DELETE) - ТЕПЕР ПРАВИЛЬНО ПОРІВНЮЄ ID
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

  // 4. ОНОВЛЕННЯ (PUT) - ТЕПЕР ПРАВИЛЬНО ПОРІВНЮЄ ID
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
}));
