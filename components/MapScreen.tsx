
import React from 'react';
import type { Level, PlayerProgress } from '../types';
import { LockIcon, StarIcon } from './Icon';
import { playClickSound } from '../services/audioService';

interface MapScreenProps {
  levels: Level[];
  progress: PlayerProgress;
  onSelectLevel: (levelId: number) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ levels, progress, onSelectLevel }) => {

  const handleLevelClick = (levelId: number) => {
    playClickSound();
    onSelectLevel(levelId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-sky-50">
        <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-5xl font-black text-sky-800 mb-2">Algox Códigos</h1>
            <p className="text-sky-600 mb-12">Complete fases para desbloquear caminhos secretos</p>
            
            <div className="flex flex-wrap items-center justify-center gap-8">
                {levels.map(level => {
                const levelProgress = progress[level.id];
                const isUnlocked = levelProgress?.unlocked;

                return (
                    <button
                    key={level.id}
                    onClick={() => isUnlocked && handleLevelClick(level.id)}
                    disabled={!isUnlocked}
                    className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                        isUnlocked ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400'
                    }`}
                    >
                    {!isUnlocked && <LockIcon className="absolute w-8 h-8 text-gray-600" />}
                    <span className={`text-4xl font-black ${!isUnlocked ? 'opacity-50' : ''}`}>{level.id}</span>
                    <span className={`text-xs ${!isUnlocked ? 'opacity-50' : ''}`}>{level.name}</span>

                    {isUnlocked && (
                        <div className="absolute -bottom-2 flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <StarIcon
                            key={i}
                            className={`w-5 h-5 ${i < levelProgress.stars ? 'text-yellow-400 fill-current' : 'text-sky-300'}`}
                            />
                        ))}
                        </div>
                    )}
                    </button>
                );
                })}
            </div>
        </div>
        <footer className="w-full max-w-lg mt-12 p-4">
            <div className="flex justify-around bg-white/70 rounded-full shadow-inner px-4 py-2">
                 <button disabled className="px-6 py-2 font-bold text-gray-400 cursor-not-allowed">Sandbox</button>
                 <button disabled className="px-6 py-2 font-bold text-gray-400 cursor-not-allowed">Loja</button>
            </div>
        </footer>
    </div>
  );
};

export default MapScreen;