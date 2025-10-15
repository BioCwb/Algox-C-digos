import React from 'react';
import { CompassIcon } from './Icon';

interface HeaderProps {
    onNewGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewGame }) => {
  return (
    <header className="text-center p-4 border-b border-gray-700/50 max-w-4xl w-full mx-auto flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="w-20"></div>
        <div className="flex items-center gap-3">
            <CompassIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-gray-100 tracking-wider">
                Gemini Adventure
            </h1>
        </div>
        <div className="w-20 flex justify-end">
            <button
                onClick={onNewGame}
                className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-cyan-500 hover:text-gray-900 rounded-md transition-colors duration-200 font-semibold"
            >
                New Game
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;