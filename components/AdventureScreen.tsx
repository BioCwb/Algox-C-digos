import React, { useState, useEffect, useRef } from 'react';
import type { StorySegment, GameState } from '../types';
import { getInitialStory, getNextStoryStep } from '../services/geminiService';
import GameStatus from './GameStatus';
import StoryDisplay from './StoryDisplay';
import UserInput from './UserInput';
import LoadingIndicator from './LoadingIndicator';

interface AdventureScreenProps {
    onBackToMap: () => void;
}

const AdventureScreen: React.FC<AdventureScreenProps> = ({ onBackToMap }) => {
    const [storyHistory, setStoryHistory] = useState<StorySegment[]>([]);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const storyEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [storyHistory, isLoading]);

    const startNewGame = async () => {
        setIsLoading(true);
        setStoryHistory([]);
        setGameState(null);
        try {
            const response = await getInitialStory();
            setGameState({
                location: response.location,
                inventory: response.inventory,
                objective: response.objective,
                gameOver: response.gameOver
            });
            setStoryHistory([{ type: 'narrator', text: response.story }]);
        } catch (error: any) {
            setStoryHistory([{ type: 'error', text: error.message }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        startNewGame();
    }, []);

    const handleUserInput = async (input: string) => {
        if (!gameState || gameState.gameOver) return;

        const newHistory = [...storyHistory, { type: 'player', text: input }];
        setStoryHistory(newHistory);
        setIsLoading(true);

        try {
            const response = await getNextStoryStep(newHistory, gameState, input);
            setGameState({
                location: response.location,
                inventory: response.inventory,
                objective: response.objective,
                gameOver: response.gameOver
            });
            setStoryHistory([...newHistory, { type: 'narrator', text: response.story }]);
        } catch (error: any) {
            setStoryHistory([...newHistory, { type: 'error', text: error.message }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
             <header className="text-center p-4 border-b border-gray-700/50 max-w-4xl w-full mx-auto flex-shrink-0">
                <div className="flex items-center justify-between">
                    <button onClick={onBackToMap} className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-cyan-500 hover:text-gray-900 rounded-md transition-colors duration-200 font-semibold">
                        &larr; Voltar ao Mapa
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-100 tracking-wider">
                            Aventura Gemini
                        </h1>
                    </div>
                     <button onClick={startNewGame} className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-cyan-500 hover:text-gray-900 rounded-md transition-colors duration-200 font-semibold">
                        Novo Jogo
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {gameState && <GameStatus gameState={gameState} />}
                    <StoryDisplay storyHistory={storyHistory} />
                    {isLoading && <LoadingIndicator />}
                     {gameState?.gameOver && (
                        <div className="mt-6 p-4 bg-cyan-900/50 border-t-2 border-cyan-500 text-center rounded-lg">
                            <p className="font-bold text-lg text-cyan-300">FIM DE JOGO</p>
                            <p className="text-gray-300 mt-2">Obrigado por jogar! Clique em "Novo Jogo" para começar uma nova aventura.</p>
                        </div>
                    )}
                    <div ref={storyEndRef} />
                </div>
            </main>

            <footer className="p-4 md:p-6 border-t border-gray-700/50">
                <div className="max-w-4xl mx-auto">
                     <UserInput onSubmit={handleUserInput} isLoading={isLoading || (gameState?.gameOver ?? false)} />
                </div>
            </footer>
        </div>
    );
};

export default AdventureScreen;
