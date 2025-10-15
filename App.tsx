

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { PlayerProgress, ResultState, UserProfile } from './types';
import { LEVELS } from './game/levels';
import MapScreen from './components/MapScreen';
import EditorScreen from './components/EditorScreen';
import ResultScreen from './components/ResultScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import { auth } from './services/firebase';
import { getUserProgress, saveUserProgress, getUserProfile } from './services/firestoreService';

const App: React.FC = () => {
    const [screen, setScreen] = useState<'map' | 'editor'>('map');
    const [result, setResult] = useState<ResultState | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [progress, setProgress] = useState<PlayerProgress>({ 1: { unlocked: true, stars: 0 } });
    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                // Fetch both progress and profile
                const [userProgress, profile] = await Promise.all([
                    getUserProgress(user.uid),
                    getUserProfile(user.uid)
                ]);
                setProgress(userProgress);
                setUserProfile(profile);
            } else {
                setUser(null);
                setUserProfile(null);
                setProgress({ 1: { unlocked: true, stars: 0 } });
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Save progress to Firestore whenever it changes for a logged-in user
    useEffect(() => {
        if (user && !authLoading && userProfile) { // Ensure userProfile is loaded
            saveUserProgress(user.uid, progress);
        }
    }, [progress, user, authLoading, userProfile]);

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

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile);
    }

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
    
    if (!user || !userProfile) {
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
                    preferredLanguage={userProfile.preferredLanguage}
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
            {isProfileOpen && user && userProfile && (
                <ProfileScreen 
                    user={user}
                    userProfile={userProfile}
                    progress={progress}
                    levels={LEVELS}
                    onClose={() => setIsProfileOpen(false)}
                    onSignOut={handleSignOut}
                    onUserUpdate={handleUserUpdate}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
};

export default App;
