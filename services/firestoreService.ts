import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { PlayerProgress } from '../types';

const defaultProgress: PlayerProgress = {
    1: { unlocked: true, stars: 0 }
};

export const getUserProgress = async (userId: string): Promise<PlayerProgress> => {
    const userDocRef = doc(db, 'userProgress', userId);
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            // Garante que o nível 1 está sempre desbloqueado
            const data = docSnap.data() as PlayerProgress;
            if (!data[1] || !data[1].unlocked) {
                data[1] = { unlocked: true, stars: data[1]?.stars || 0 };
            }
            return data;
        } else {
            // Se não existir, cria o progresso inicial
            await setDoc(userDocRef, defaultProgress);
            return defaultProgress;
        }
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return defaultProgress; // Retorna o padrão em caso de erro
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
