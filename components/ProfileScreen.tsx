
import React, { useMemo } from 'react';
import type { User } from 'firebase/auth';
import type { PlayerProgress, Level, LevelProgress } from '../types';
import { UserIcon, StarIcon, CloseIcon, AwardIcon, LogOutIcon } from './Icon';

interface ProfileScreenProps {
  user: User;
  progress: PlayerProgress;
  levels: Level[];
  onClose: () => void;
  onSignOut: () => void;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    isUnlocked: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, progress, levels, onClose, onSignOut }) => {

    const stats = useMemo(() => {
        // FIX: Explicitly type the 'sum' parameter in the reduce function to prevent it from being inferred as 'unknown'.
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
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-10 h-10 text-sky-600" />
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