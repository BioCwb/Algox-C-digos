

import React, { useMemo, useState } from 'react';
import type { Level, PlayerProgress } from '../types';
import { LockIcon, StarIcon, UserIcon, CompassIcon, PlayIcon } from './Icon';
import { playClickSound } from '../services/audioService';

interface MapScreenProps {
  levels: Level[];
  progress: PlayerProgress;
  onSelectLevel: (levelId: number) => void;
  onOpenProfile: () => void;
  onStartAdventure: () => void;
}

// Helper function to determine the most relevant level to show the player
const findCurrentLevelId = (progress: PlayerProgress, levels: Level[]): number => {
    const highestCompletedId = Math.max(0, ...Object.keys(progress)
        .filter(levelId => progress[parseInt(levelId)]?.stars > 0)
        .map(levelId => parseInt(levelId))
    );
    
    const maxLevelId = Math.max(...levels.map(l => l.id));
    
    let currentId = highestCompletedId + 1;
    // If the next level doesn't exist, they're at the end. Show the last level.
    if (currentId > maxLevelId && maxLevelId > 0) {
        currentId = maxLevelId;
    }
    
    // If no level is completed, start at 1.
    return highestCompletedId === 0 ? 1 : currentId;
};


// --- Card Components for the "Path" View ---

const CompletedLevelCard = ({ level, progress, onSelectLevel }: { level: Level, progress: PlayerProgress, onSelectLevel: (id: number) => void }) => (
    <details className="bg-white rounded-lg shadow-md transition-all duration-300 animate-in fade-in slide-in-from-top-4">
        <summary className="p-4 cursor-pointer font-bold text-lg flex justify-between items-center text-gray-600 hover:bg-gray-50 rounded-t-lg">
            <span>Nível {level.id}: {level.name}</span>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">CONCLUÍDO</span>
        </summary>
        <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-between items-center">
            <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                    <StarIcon key={i} className={`w-6 h-6 ${i < (progress[level.id]?.stars || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
            </div>
            <button 
                onClick={() => onSelectLevel(level.id)}
                className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors"
            >
                Rejogar
            </button>
        </div>
    </details>
);

const CurrentLevelCard = ({ level, onSelectLevel }: { level: Level, onSelectLevel: (id: number) => void }) => (
     <div className="bg-sky-100 p-6 rounded-lg shadow-lg border-2 border-sky-500 animate-in fade-in slide-in-from-top-4">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-500 text-white font-black text-2xl flex items-center justify-center rounded-full flex-shrink-0">
                {level.id}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-sky-800">{level.name}</h2>
                <p className="text-sky-700 mt-1">{level.levelType === 'blocks' ? level.description : 'Teste seus conhecimentos de código!'}</p>
            </div>
        </div>
        <button 
            onClick={() => onSelectLevel(level.id)}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-600 transition-colors"
        >
            <PlayIcon className="w-6 h-6" /> Jogar
        </button>
    </div>
);

const NextLevelCard = ({ level }: { level: Level }) => (
    <div className="p-6 bg-gray-200 rounded-lg shadow opacity-80 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
        <LockIcon className="w-8 h-8 text-gray-500 flex-shrink-0" />
        <div>
            <h3 className="font-bold text-lg text-gray-600">Próximo Nível: {level.name}</h3>
            <p className="text-sm text-gray-500">Complete o desafio anterior para desbloquear.</p>
        </div>
    </div>
);


// --- Main Map Screen Component ---

const MapScreen: React.FC<MapScreenProps> = ({ levels, progress, onSelectLevel, onOpenProfile, onStartAdventure }) => {
  const [view, setView] = useState<'path' | 'grid'>('path');

  const highestCompletedLevelId = useMemo(() => {
    return Math.max(0, ...Object.keys(progress)
        .filter(levelId => progress[parseInt(levelId)]?.stars > 0)
        .map(levelId => parseInt(levelId))
    );
  }, [progress]);
  
  const currentLevelId = useMemo(() => findCurrentLevelId(progress, levels), [progress, levels]);
  const completedLevel = levels.find(l => l.id === currentLevelId - 1);
  const currentLevel = levels.find(l => l.id === currentLevelId);
  const nextLevel = levels.find(l => l.id === currentLevelId + 1);

  const handleSelectAndPlay = (levelId: number) => {
    playClickSound();
    onSelectLevel(levelId);
  };
  
  const handleProfileClick = () => {
    playClickSound();
    onOpenProfile();
  };
  
  const handleAdventureClick = () => {
    playClickSound();
    onStartAdventure();
  };
  
  const handleToggleView = () => {
    playClickSound();
    setView(v => v === 'path' ? 'grid' : 'path');
  }

  const GridView = () => {
    const highestVisibleLevelId = Math.max(5, highestCompletedLevelId + 1);
    const visibleLevels = levels.filter(level => level.id <= highestVisibleLevelId);

    return (
        <div className="flex flex-wrap items-center justify-center gap-8 animate-in fade-in">
            {visibleLevels.map(level => {
            const levelProgress = progress[level.id];
            const isUnlocked = levelProgress?.unlocked;

            return (
                <button
                key={level.id}
                onClick={() => isUnlocked && handleSelectAndPlay(level.id)}
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
                        className={`w-5 h-5 ${i < (levelProgress?.stars || 0) ? 'text-yellow-400 fill-current' : 'text-sky-300'}`}
                        />
                    ))}
                    </div>
                )}
                </button>
            );
            })}
        </div>
    );
  };

  const PathView = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6">
        {completedLevel && progress[completedLevel.id]?.stars > 0 && (
            <CompletedLevelCard 
                level={completedLevel} 
                progress={progress} 
                onSelectLevel={handleSelectAndPlay} 
            />
        )}
        {currentLevel && progress[currentLevel.id]?.unlocked && (
            <CurrentLevelCard 
                level={currentLevel} 
                onSelectLevel={handleSelectAndPlay} 
            />
        )}
        {nextLevel && (
            <NextLevelCard level={nextLevel} />
        )}
        {!currentLevel && (
             <div className="text-center p-8 bg-green-100 rounded-lg">
                <h2 className="text-3xl font-bold text-green-800">Parabéns!</h2>
                <p className="text-green-700 mt-2">Você completou todos os desafios disponíveis!</p>
            </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-sky-50">
        <div className="flex-grow w-full flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-black text-sky-800 mb-2">Algox Códigos</h1>
                <p className="text-sky-600 mb-4">Complete fases para desbloquear caminhos secretos</p>
                <button onClick={handleToggleView} className="px-4 py-2 mb-8 text-sm bg-white border rounded-full shadow-sm hover:bg-gray-100 text-sky-600 font-semibold">
                    {view === 'path' ? 'Ver Mapa Completo' : 'Ver Caminho Atual'}
                </button>
            </div>
            
            {view === 'path' ? <PathView /> : <GridView />}

        </div>
        <footer className="w-full max-w-lg mt-12 p-4">
            <div className="flex justify-around bg-white/70 rounded-full shadow-inner px-4 py-2">
                 <button onClick={handleAdventureClick} className="px-6 py-2 font-bold text-sky-700 hover:bg-sky-100 rounded-full flex items-center gap-2">
                    <CompassIcon className="w-5 h-5" />
                    Aventura
                 </button>
                 <button onClick={handleProfileClick} className="px-6 py-2 font-bold text-sky-700 hover:bg-sky-100 rounded-full flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Perfil
                 </button>
                 <button disabled className="px-6 py-2 font-bold text-gray-400 cursor-not-allowed">Loja</button>
            </div>
        </footer>
    </div>
  );
};

export default MapScreen;