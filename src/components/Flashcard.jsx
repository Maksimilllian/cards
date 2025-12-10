import React from 'react';
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
export default Flashcard;