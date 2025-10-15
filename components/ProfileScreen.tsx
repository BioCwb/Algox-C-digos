

import React, { useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { PlayerProgress, Level, LevelProgress, UserProfile, Language } from '../types';
import { UserIcon, StarIcon, CloseIcon, AwardIcon, LogOutIcon, PencilIcon } from './Icon';
import { auth, storage } from '../services/firebase';
import { updateUserProfile } from '../services/firestoreService';

interface ProfileScreenProps {
  user: User;
  userProfile: UserProfile;
  progress: PlayerProgress;
  levels: Level[];
  onClose: () => void;
  onSignOut: () => void;
  onUserUpdate: (user: User) => void;
  onProfileUpdate: (profile: UserProfile) => void;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    isUnlocked: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, userProfile, progress, levels, onClose, onSignOut, onUserUpdate, onProfileUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [language, setLanguage] = useState<Language>(userProfile.preferredLanguage);
    const [isSaving, setIsSaving] = useState(false);

    const stats = useMemo(() => {
        const totalStars = Object.values(progress).reduce((sum: number, level: LevelProgress) => sum + (level.stars || 0), 0);
        const levelsCompleted = Object.values(progress).filter((level: LevelProgress) => level.stars > 0).length;
        return { totalStars, levelsCompleted };
    }, [progress]);

    const achievements: Achievement[] = useMemo(() => {
        const hasCompletedLevel1 = progress[1]?.stars > 0;
        const threeStarLevels = Object.values(progress).filter((p: LevelProgress) => p.stars === 3).length;
        const hasCompletedAll = levels.length > 0 && levels.every(level => progress[level.id]?.stars > 0);
        
        return [
            { id: 'start', title: 'Primeiro Código', description: 'Complete o primeiro nível.', isUnlocked: hasCompletedLevel1 },
            { id: 'perfect', title: 'Perfeccionista', description: 'Consiga 3 estrelas em 3 níveis.', isUnlocked: threeStarLevels >= 3 },
            { id: 'master', title: 'Mestre dos Blocos', description: 'Complete todos os níveis disponíveis.', isUnlocked: hasCompletedAll },
        ];
    }, [progress, levels]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !auth.currentUser) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
            const snapshot = await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(snapshot.ref);

            await updateProfile(auth.currentUser, { photoURL });
            onUserUpdate({ ...auth.currentUser, photoURL });
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value as Language;
        setLanguage(newLanguage);
        setIsSaving(true);
        try {
            await updateUserProfile(user.uid, { preferredLanguage: newLanguage });
            onProfileUpdate({ ...userProfile, preferredLanguage: newLanguage });
        } catch (error) {
            console.error("Failed to update language", error);
            setLanguage(userProfile.preferredLanguage); // Revert on error
        } finally {
            setIsSaving(false);
        }
    };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform transition-all animate-in zoom-in-90" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-sky-800">Seu Perfil</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-sky-50 rounded-lg mb-6">
            <div className="flex items-center gap-4">
                 <div className="relative w-16 h-16 flex-shrink-0">
                    <button onClick={handleAvatarClick} disabled={isUploading} className="w-full h-full rounded-full bg-sky-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Foto do perfil" className="w-full h-full rounded-full object-cover"/>
                        ) : (
                            <UserIcon className="w-10 h-10 text-sky-600" />
                        )}
                         <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <PencilIcon className="w-6 h-6" />
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-sky-900 truncate" title={user.email || 'Usuário'}>
                        {user.email}
                    </h3>
                    <p className="text-sky-700">Explorando o mundo do código!</p>
                </div>
            </div>
            <button 
                onClick={onSignOut} 
                className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
                <LogOutIcon className="w-5 h-5" />
                Sair
            </button>
        </div>
        
        <div className="mb-6">
            <label htmlFor="language-select" className="block text-sm font-bold text-sky-800 mb-2">Linguagem de Programação</label>
            <div className="relative">
                <select 
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                    disabled={isSaving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white appearance-none"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                </select>
                {isSaving && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-500 flex items-center justify-center gap-2">{stats.totalStars} <StarIcon className="w-7 h-7" /></p>
                <p className="text-sm font-semibold text-gray-600">Total de Estrelas</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-sky-600">{stats.levelsCompleted}</p>
                <p className="text-sm font-semibold text-gray-600">Níveis Completos</p>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-sky-800 mb-4">Medalhas</h3>
            <div className="space-y-3">
                {achievements.map(ach => (
                    <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-opacity ${ach.isUnlocked ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ach.isUnlocked ? 'bg-green-200' : 'bg-gray-200'}`}>
                            <AwardIcon className={`w-6 h-6 ${ach.isUnlocked ? 'text-green-700' : 'text-gray-500'}`} />
                        </div>
                        <div>
                            <p className={`font-bold ${ach.isUnlocked ? 'text-green-900' : 'text-gray-700'}`}>{ach.title}</p>
                            <p className={`text-sm ${ach.isUnlocked ? 'text-green-700' : 'text-gray-500'}`}>{ach.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
