
import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { PlayerProgress, ResultState } from './types';
import { LEVELS } from './game/levels';
import MapScreen from './components/MapScreen';
import EditorScreen from './components/EditorScreen';
import ResultScreen from './components/ResultScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import { auth } from './services/firebase';
import { getUserProgress, saveUserProgress } from './services/firestoreService';

const App: React.FC = () => {
    const [screen, setScreen] = useState<'map' | 'editor'>('map');
    const [result, setResult] = useState<ResultState | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [progress, setProgress] = useState<PlayerProgress>({ 1: { unlocked: true, stars: 0 } });
    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userProgress = await getUserProgress(user.uid);
                setProgress(userProgress);
            } else {
                setUser(null);
                // Reset to default progress if logged out
                setProgress({ 1: { unlocked: true, stars: 0 } });
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Save progress to Firestore whenever it changes for a logged-in user
    useEffect(() => {
        if (user && !authLoading) {
            saveUserProgress(user.uid, progress);
        }
    }, [progress, user, authLoading]);

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
                [resultData.levelId]: { ...progress[resultData.levelId], unlocked: true, stars: newStars },
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
    
    const handleSignOut = async () => {
        await signOut(auth);
        setIsProfileOpen(false);
    };
    
    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const handleReplay = () => {
        setResult(null);
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

    if (authLoading) {
        return (
            <div className="h-screen w-screen bg-sky-50 flex items-center justify-center">
                <div className="text-sky-600 font-bold">Carregando...</div>
            </div>
        );
    }
    
    if (!user) {
        return <LoginScreen />;
    }

    return (
        <div className="h-screen w-screen bg-sky-50">
            {screen === 'map' && (
                <MapScreen 
                    levels={LEVELS} 
                    progress={progress} 
                    onSelectLevel={handleSelectLevel} 
                    onOpenProfile={() => setIsProfileOpen(true)}
                />
            )}
            {screen === 'editor' && currentLevel && (
                <EditorScreen 
                    key={currentLevel.id} 
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
            {isProfileOpen && user && (
                <ProfileScreen 
                    user={user}
                    progress={progress}
                    levels={LEVELS}
                    onClose={() => setIsProfileOpen(false)}
                    onSignOut={handleSignOut}
                    onUserUpdate={handleUserUpdate}
                />
            )}
        </div>
    );
};

export default App;