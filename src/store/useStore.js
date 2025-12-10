import { create } from "zustand";

export const useStore = create((set, get) => ({
  decks: [],
  isLoading: true,

  // 1. ЗАВАНТАЖЕННЯ (GET)
  loadDecks: async () => {
    set({ isLoading: true });
    try {
      // Звернення до Vercel Serverless Function
      const response = await fetch("/api/decks");
      if (!response.ok) throw new Error("Failed to fetch decks");
      const cloudDecks = await response.json();
      set({ decks: cloudDecks, isLoading: false });
    } catch (error) {
      console.error("Error loading decks from cloud:", error);
      // Можна завантажити заглушки у випадку помилки (опціонально)
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

      set((state) => ({
        decks: [...state.decks, newDeck],
      }));
    } catch (error) {
      console.error("Error adding deck:", error);
      throw error;
    }
  },

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
      const finalDeck = await response.json();

      set((state) => ({
        decks: state.decks.map((d) => (d.id === id ? finalDeck : d)),
      }));
    } catch (error) {
      console.error("Error updating deck:", error);
      throw error;
    }
  },
}));
