import React from 'react';
import type { GameState } from '../types';

interface GameStatusProps {
    gameState: GameState;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState }) => {
    return (
        <div className="mb-6 p-4 bg-black/20 border border-gray-700/50 rounded-lg text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold text-cyan-400 tracking-wider mb-2">LOCATION</h3>
                    <p className="text-gray-300">{gameState.location}</p>
                </div>
                <div>
                    <h3 className="font-bold text-cyan-400 tracking-wider mb-2">INVENTORY</h3>
                    <p className="text-gray-300 italic">
                        {gameState.inventory.length > 0 ? gameState.inventory.join(', ') : 'Empty'}
                    </p>
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-700/50">
                <h3 className="font-bold text-cyan-400 tracking-wider mb-2">OBJECTIVE</h3>
                <p className="text-gray-300">{gameState.objective}</p>
            </div>
        </div>
    );
};

export default GameStatus;