
import React, { useEffect } from 'react';
import type { ResultState } from '../types';
import { StarIcon, ArrowRightIcon, MapIcon } from './Icon';
import { playSuccessSound, playFailureSound, playClickSound } from '../services/audioService';

interface ResultScreenProps {
  result: ResultState;
  onNextLevel: () => void;
  onReplay: () => void;
  onMap: () => void;
  isLastLevel: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onNextLevel, onReplay, onMap, isLastLevel }) => {
  useEffect(() => {
    if (result.success) {
      playSuccessSound();
    } else {
      playFailureSound();
    }
  }, [result.success]);

  const handleReplay = () => {
    playClickSound();
    onReplay();
  };

  const handleNextLevel = () => {
    playClickSound();
    onNextLevel();
  };

  const handleMap = () => {
    playClickSound();
    onMap();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full transform transition-all animate-in zoom-in-75">
        <h2 className="text-4xl font-black mb-2 text-gray-800">
          {result.success ? "Parabéns!" : "Tente Novamente!"}
        </h2>
        <p className="text-gray-600 mb-6">
          {result.success
            ? `Você completou o Nível ${result.levelId}!`
            : "Não desista, você consegue!"}
        </p>
        
        {result.success && (
          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(3)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-12 h-12 transition-all duration-300 ease-in-out ${i < result.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                style={{ transform: i < result.stars ? 'scale(1)' : 'scale(0.8)', opacity: i < result.stars ? 1 : 0.5, transitionDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleReplay}
            className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Repetir
          </button>
          {result.success && !isLastLevel && (
            <button
              onClick={handleNextLevel}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Próximo Nível <ArrowRightIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleMap}
            className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapIcon className="w-5 h-5" /> Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;