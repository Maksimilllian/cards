import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { User } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Layers className="w-6 h-6" />
            <span>FlashLearn</span>
          </Link>
          <nav className="flex items-center gap-4">
            {/* Нова кнопка Про автора */}
            <Link to="/about" className="flex items-center gap-2 text-indigo-100 hover:text-white transition">
               <User size={20} />
               <span className="hidden sm:inline">Про автора</span>
            </Link>

            {/* Стара кнопка Створити набір */}
            <Link to="/create" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-semibold">
              + Створити
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        Гурова Владислава Ігорівна ДПОК-24мг
      </footer>
    </div>
  );
};
export default Layout;