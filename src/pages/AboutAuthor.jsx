// src/pages/AboutAuthor.jsx
import React from 'react';
import { Github, Mail, MapPin } from 'lucide-react'; // Додаткові іконки для краси

const AboutAuthor = () => {
  // Тут посилання на фото. Можна замінити на своє.
  const authorImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Картка автора */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Верхній кольоровий фон (cover) */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        <div className="px-8 pb-8">
          {/* Фото автора (кругле, з білою рамкою, підняте вгору) */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <img 
              src={authorImage} 
              alt="Author" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>

          {/* Основна інформація */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Гурова Владислава Ігорівна</h1>
            <p className="text-indigo-600 font-medium">Студентка групи ДПОК-24мг</p>
            
            <div className="flex justify-center items-center gap-2 mt-2 text-gray-500 text-sm">
              <MapPin size={16} />
              <span>Україна, Вінниця</span>
            </div>
          </div>

          {/* Опис діяльності (Біографія) */}
          <div className="space-y-4 text-gray-600 leading-relaxed text-justify px-4">
            <p>
              Вітаю! Я — розробниця цього веб-застосунку для інтерактивного навчання. 
              Моя мета полягає у створенні зручних інструментів, які допомагають студентам та школярам 
              ефективніше засвоювати новий матеріал.
            </p>
            <p>
              Цей проєкт "FlashLearn" був створений як частина моєї навчальної практики. 
              Він демонструє мої навички роботи з сучасними веб-технологіями, такими як React, 
              керування станом та адаптивна верстка.
            </p>
            <p>
              Я вірю, що технології повинні бути доступними та інтуїтивно зрозумілими. 
              Сподіваюся, що ці інтерактивні картки допоможуть вам у навчанні так само, 
              як їх створення допомогло мені у професійному зростанні.
            </p>
          </div>

          {/* Розділювач */}
          <hr className="my-6 border-gray-100" />

          {/* Контакти (кнопки) */}
          <div className="flex justify-center gap-4">
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <Mail size={18} /> Написати мені
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition">
              <Github size={18} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAuthor;