import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { PlayerProgress, UserProfile, Language } from '../types';

const defaultProgress: PlayerProgress = {
    1: { unlocked: true, stars: 0 }
};

// --- Funções de Progresso do Jogador ---

export const getUserProgress = async (userId: string): Promise<PlayerProgress> => {
    const userDocRef = doc(db, 'userProgress', userId);
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as PlayerProgress;
            if (!data[1] || !data[1].unlocked) {
                data[1] = { unlocked: true, stars: data[1]?.stars || 0 };
            }
            return data;
        } else {
            await setDoc(userDocRef, defaultProgress);
            return defaultProgress;
        }
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return defaultProgress;
    }
};

export const saveUserProgress = async (userId: string, progress: PlayerProgress): Promise<void> => {
    const userDocRef = doc(db, 'userProgress', userId);
    try {
        await setDoc(userDocRef, progress);
    } catch (error) {
        console.error("Error saving user progress:", error);
    }
};

// --- Funções de Perfil do Usuário ---

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const profileDocRef = doc(db, 'users', userId);
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            // Default adventureLevel for backward compatibility
            if (data.adventureLevel === undefined) {
                data.adventureLevel = 1;
            }
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const createUserProfile = async (userId: string, email: string | null, preferredLanguage: Language): Promise<UserProfile> => {
    const profileDocRef = doc(db, 'users', userId);
    const newProfile: UserProfile = { 
        email: email || 'usuário@algox.com', 
        preferredLanguage,
        adventureLevel: 1 
    };
    try {
        await setDoc(profileDocRef, newProfile);
        return newProfile;
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
    const profileDocRef = doc(db, 'users', userId);
    try {
        await setDoc(profileDocRef, updates, { merge: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};