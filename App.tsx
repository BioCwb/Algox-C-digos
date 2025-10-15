
import React, { useState } from 'react';
import type { PlayerProgress, ResultState, Level } from './types';
import { LEVELS } from './game/levels';
import MapScreen from './components/MapScreen';
import EditorScreen from './components/EditorScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
    const [screen, setScreen] = useState<'map' | 'editor'>('map');
    const [result, setResult] = useState<ResultState | null>(null);

    // Initialize progress with level 1 unlocked
    const [progress, setProgress] = useState<PlayerProgress>({
        1: { unlocked: true, stars: 0 }
    });

    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

    const handleSelectLevel = (levelId: number) => {
        setCurrentLevelId(levelId);
        setScreen('editor');
    };

    const handleBackToMap = () => {
        setCurrentLevelId(null);
        setResult(null);
        setScreen('map');
    };

    const handleLevelComplete = (resultData: ResultState) => {
        setResult(resultData);
        if (resultData.success) {
            const currentStars = progress[resultData.levelId]?.stars || 0;
            const newStars = Math.max(currentStars, resultData.stars);
            const nextLevelId = resultData.levelId + 1;

            const newProgress: PlayerProgress = {
                ...progress,
                [resultData.levelId]: { ...progress[resultData.levelId], stars: newStars },
            };

            if (LEVELS.find(l => l.id === nextLevelId)) {
                newProgress[nextLevelId] = { 
                    unlocked: true, 
                    stars: progress[nextLevelId]?.stars || 0 
                };
            }
            setProgress(newProgress);
        }
    };

    const handleReplay = () => {
        setResult(null); // Go back to the editor for the same level
    };

    const handleNextLevel = () => {
        if (result) {
            const nextLevelId = result.levelId + 1;
            const nextLevel = LEVELS.find(l => l.id === nextLevelId);
            if (nextLevel) {
                setCurrentLevelId(nextLevelId);
                setResult(null);
            } else {
                handleBackToMap();
            }
        }
    };
    
    const currentLevel = LEVELS.find(l => l.id === currentLevelId);

    return (
        <div className="h-screen w-screen bg-sky-50">
            {screen === 'map' && (
                <MapScreen 
                    levels={LEVELS} 
                    progress={progress} 
                    onSelectLevel={handleSelectLevel} 
                />
            )}
            {screen === 'editor' && currentLevel && (
                <EditorScreen 
                    key={currentLevel.id} // Add key to force re-mount on level change
                    level={currentLevel} 
                    onBackToMap={handleBackToMap} 
                    onLevelComplete={handleLevelComplete} 
                />
            )}
            {result && (
                <ResultScreen 
                    result={result} 
                    onNextLevel={handleNextLevel} 
                    onReplay={handleReplay} 
                    onMap={handleBackToMap}
                    isLastLevel={!LEVELS.find(l => l.id === result.levelId + 1)}
                />
            )}
        </div>
    );
};

export default App;
