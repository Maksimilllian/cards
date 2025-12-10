import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateDeck from './pages/CreateDeck';
import StudyFlashcards from './pages/StudyFlashcards';
import StudyQuiz from './pages/StudyQuiz';
import StudyMatch from './pages/StudyMatch';
import AboutAuthor from './pages/AboutAuthor';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/edit/:id" element={<CreateDeck />} />
          <Route path="/about" element={<AboutAuthor />} />
          <Route path="/study/:deckId/flashcards" element={<StudyFlashcards />} />
          <Route path="/study/:deckId/quiz" element={<StudyQuiz />} />
          <Route path="/study/:deckId/match" element={<StudyMatch />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;