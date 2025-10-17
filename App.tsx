import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { PlayerProgress, ResultState, UserProfile } from './types';
import { LEVELS } from './game/levels';
import MapScreen from './components/MapScreen';
import EditorScreen from './components/EditorScreen';
import CodeQuizScreen from './components/CodeQuizScreen';
import ResultScreen from './components/ResultScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import AdventureScreen from './components/AdventureScreen';
import { auth } from './services/firebase';
import { getUserProgress, saveUserProgress, getUserProfile, createUserProfile, updateUserProfile } from './services/firestoreService';

const App: React.FC = () => {
    const [screen, setScreen] = useState<'map' | 'editor' | 'code-quiz' | 'adventure'>('map');
    const [result, setResult] = useState<ResultState | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [progress, setProgress] = useState<PlayerProgress>({ 1: { unlocked: true, stars: 0 } });
    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setUserProfile(null);
                setProgress({ 1: { unlocked: true, stars: 0 } });
                setIsLoading(false);
                return;
            }
    
            setUser(currentUser);
            let profile = await getUserProfile(currentUser.uid);
            
            if (!profile) {
                console.log("No profile found for user, creating a default one.");
                try {
                    profile = await createUserProfile(currentUser.uid, currentUser.email, 'javascript');
                } catch (error) {
                    console.error("Critical error: Failed to create user profile. Signing out.", error);
                    await signOut(auth);
                    return;
                }
            }
    
            const userProgress = await getUserProgress(currentUser.uid);
            setUserProfile(profile);
            setProgress(userProgress);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Save progress to Firestore whenever it changes for a logged-in user
    useEffect(() => {
        if (user && userProfile) { 
            saveUserProgress(user.uid, progress);
        }
    }, [progress, user, userProfile]);

    const handleSelectLevel = (levelId: number) => {
        const level = LEVELS.find(l => l.id === levelId);
        if (!level) return;

        setCurrentLevelId(levelId);
        if (level.levelType === 'code-quiz') {
            setScreen('code-quiz');
        } else {
            setScreen('editor');
        }
    };
    
    const handleStartAdventure = () => {
        setScreen('adventure');
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

    const handleAdventureProgress = async (nextLevelNumber: number) => {
        if (!user || !userProfile) return;
    
        // Only update if the user is advancing
        if (nextLevelNumber <= userProfile.adventureLevel) return;
    
        const updatedProfile = { ...userProfile, adventureLevel: nextLevelNumber };
        setUserProfile(updatedProfile); // Update local state for immediate UI feedback
        await updateUserProfile(user.uid, { adventureLevel: nextLevelNumber }); // Persist to Firestore
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
                handleSelectLevel(nextLevelId);
                setResult(null);
            } else {
                handleBackToMap();
            }
        }
    };
    
    const currentLevel = LEVELS.find(l => l.id === currentLevelId);

    if (isLoading) {
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
                    onStartAdventure={handleStartAdventure}
                />
            )}
            {screen === 'editor' && currentLevel && currentLevel.levelType === 'blocks' && (
                <EditorScreen 
                    key={currentLevel.id} 
                    level={currentLevel} 
                    onBackToMap={handleBackToMap} 
                    onLevelComplete={handleLevelComplete}
                    preferredLanguage={userProfile.preferredLanguage}
                />
            )}
             {screen === 'code-quiz' && currentLevel && currentLevel.levelType === 'code-quiz' && (
                <CodeQuizScreen
                    key={currentLevel.id}
                    level={currentLevel}
                    onBackToMap={handleBackToMap}
                    onQuizComplete={handleLevelComplete}
                />
            )}
            {screen === 'adventure' && userProfile && (
                <AdventureScreen 
                    onBackToMap={handleBackToMap}
                    initialLevel={userProfile.adventureLevel}
                    onSaveProgress={handleAdventureProgress}
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