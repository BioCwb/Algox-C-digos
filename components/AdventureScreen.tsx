import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PlayIcon, ResetIcon, LockIcon } from './Icon';
import { ADVENTURE_LEVELS, AdventureLevel } from '../game/adventureLevels';
import { playClickSound } from '../services/audioService';

interface AdventureScreenProps {
    onBackToMap: () => void;
    initialLevel: number;
    onSaveProgress: (newLevel: number) => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface BunnyState {
    x: number;
    y: number;
    dir: Direction;
    rotation: number;
}

const TILE_SIZE = 'w-12 h-12 md:w-16 md:h-16';

const TILE_EMOJI: { [key: string]: string } = {
    'P': '',
    'X': '🌵',
    'C': '🥕',
};

const DIRECTION_VECTORS: { [key in Direction]: { x: number; y: number } } = {
    'UP': { x: 0, y: -1 },
    'DOWN': { x: 0, y: 1 },
    'LEFT': { x: -1, y: 0 },
    'RIGHT': { x: 1, y: 0 },
};

const ROTATION_MAP: { [key in Direction]: number } = {
    'RIGHT': 0,
    'DOWN': 90,
    'LEFT': 180,
    'UP': 270,
};

const getInitialBunnyState = (grid: string[][]): BunnyState => {
    const startPos = { x: 0, y: 0 };
    for (let y = 0; y < grid.length; y++) {
        const x = grid[y].indexOf('S');
        if (x !== -1) {
            startPos.x = x;
            startPos.y = y;
            break;
        }
    }
    return { x: startPos.x, y: startPos.y, dir: 'RIGHT', rotation: 0 };
};


// --- Sub-components for different level states ---

const CompletedLevelCard = ({ level }: { level: AdventureLevel }) => (
    <details className="bg-white rounded-lg shadow-md transition-all duration-300">
        <summary className="p-4 cursor-pointer font-bold text-lg flex justify-between items-center text-gray-600 hover:bg-gray-50 rounded-t-lg">
            <span>Nível {level.id}: {level.name}</span>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">CONCLUÍDO</span>
        </summary>
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <p className="text-sm text-gray-700 mb-4">{level.description}</p>
            <h4 className="font-bold mb-2 text-gray-800">Exemplo de Solução:</h4>
            <pre className="bg-gray-800 text-white p-3 rounded font-mono text-xs overflow-x-auto">
                <code>{level.solutionCode}</code>
            </pre>
        </div>
    </details>
);

const LockedLevelCard = ({ level }: { level: AdventureLevel }) => (
    <div className="p-4 bg-gray-200 rounded-lg shadow opacity-80 flex items-center gap-4">
        <LockIcon className="w-8 h-8 text-gray-500 flex-shrink-0" />
        <div>
            <h3 className="font-bold text-lg text-gray-600">Nível {level.id}: {level.name}</h3>
            <p className="text-sm text-gray-500">Complete o desafio anterior para desbloquear.</p>
        </div>
    </div>
);

const CurrentLevelView: React.FC<{ level: AdventureLevel; onComplete: () => void; isLastLevel: boolean }> = ({ level, onComplete, isLastLevel }) => {
    const TOTAL_CARROTS = useMemo(() => level.grid.flat().filter(c => c === 'C').length, [level]);

    const [grid, setGrid] = useState(level.grid);
    const [bunnyState, setBunnyState] = useState<BunnyState>(() => getInitialBunnyState(level.grid));
    const [collectedCarrots, setCollectedCarrots] = useState(0);
    const [code, setCode] = useState(`// ${level.name}\n// Use a API do player para mover o coelho\n`);
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState<{ status: 'idle' | 'success' | 'fail', message: string }>({ status: 'idle', message: '' });
    const [failures, setFailures] = useState(0);
    const [showSolution, setShowSolution] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const resetForLevel = useCallback(() => {
        setGrid(level.grid);
        setBunnyState(getInitialBunnyState(level.grid));
        setCollectedCarrots(0);
        setCode(`// ${level.name}\n// Use a API do player para mover o coelho\n`);
        setLogs([]);
        setIsFinished({ status: 'idle', message: '' });
        setFailures(0);
        setShowSolution(false);
    }, [level]);

    useEffect(() => {
        resetForLevel();
    }, [level, resetForLevel]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const logMessage = (message: string) => {
        setLogs(prev => [...prev.slice(-100), `[${new Date().toLocaleTimeString()}]: ${message}`]);
    };

    const handleReset = () => {
        setIsRunning(false);
        resetForLevel();
    };
    
    const handleAddCommand = (command: 'forward' | 'right' | 'left' | 'loop') => {
        playClickSound();
        let commandText = '';
        if (command === 'forward') {
            commandText = 'await player.moveForward();\n';
        } else if (command === 'right') {
            commandText = 'await player.turnRight();\n';
        } else if (command === 'left') {
            commandText = 'await player.turnLeft();\n';
        } else if (command === 'loop') {
            const times = prompt("Quantas vezes repetir?", "3");
            const count = parseInt(times || "0", 10);
            if (!isNaN(count) && count > 0) {
                 commandText = `for (let i = 0; i < ${count}; i++) {\n  // seu código aqui\n}\n`;
            } else if (times !== null) {
                alert("Por favor, insira um número válido.");
            }
        }
        
        if (commandText) {
             setCode(prevCode => prevCode.endsWith('\n') ? prevCode + commandText : prevCode + '\n' + commandText);
        }
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setGrid(level.grid);
        let tempBunnyState = getInitialBunnyState(level.grid);
        setBunnyState(tempBunnyState);
        setCollectedCarrots(0);
        setLogs([]);
        setIsFinished({ status: 'idle', message: '' });

        logMessage("Execução iniciada...");
        await new Promise(res => setTimeout(res, 100));

        let tempGrid = JSON.parse(JSON.stringify(level.grid));
        let tempCollectedCarrots = 0;

        const player = {
            moveForward: async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
                const { x: dx, y: dy } = DIRECTION_VECTORS[tempBunnyState.dir];
                const nextPos = { x: tempBunnyState.x + dx, y: tempBunnyState.y + dy };

                if (
                    nextPos.y < 0 || nextPos.y >= tempGrid.length ||
                    nextPos.x < 0 || nextPos.x >= tempGrid[0].length ||
                    tempGrid[nextPos.y][nextPos.x] === 'X'
                ) {
                    logMessage(`ERRO: Coelho bateu em um obstáculo!`);
                    throw new Error('O coelho bateu em um obstáculo!');
                }
                
                tempBunnyState = { ...tempBunnyState, x: nextPos.x, y: nextPos.y };
                setBunnyState(tempBunnyState);

                if (tempGrid[nextPos.y][nextPos.x] === 'C') {
                    tempCollectedCarrots++;
                    logMessage(`Cenoura coletada! (${tempCollectedCarrots}/${TOTAL_CARROTS})`);
                    tempGrid[nextPos.y][nextPos.x] = 'P';
                    setGrid(JSON.parse(JSON.stringify(tempGrid)));
                    setCollectedCarrots(tempCollectedCarrots);
                }
            },
            turnRight: async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
                const directions: Direction[] = ['RIGHT', 'DOWN', 'LEFT', 'UP'];
                const currentDirIndex = directions.indexOf(tempBunnyState.dir);
                const nextDir = directions[(currentDirIndex + 1) % 4];
                tempBunnyState = { ...tempBunnyState, dir: nextDir, rotation: ROTATION_MAP[nextDir] };
                setBunnyState(tempBunnyState);
            },
            turnLeft: async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
                const directions: Direction[] = ['RIGHT', 'DOWN', 'LEFT', 'UP'];
                const currentDirIndex = directions.indexOf(tempBunnyState.dir);
                const nextDir = directions[(currentDirIndex + 3) % 4];
                tempBunnyState = { ...tempBunnyState, dir: nextDir, rotation: ROTATION_MAP[nextDir] };
                setBunnyState(tempBunnyState);
            },
        };

        try {
            const asyncFunction = new Function('player', `return (async () => { ${code} })()`);
            await asyncFunction(player);

            await new Promise(resolve => setTimeout(resolve, 500));
        
            if (TOTAL_CARROTS > 0 && tempCollectedCarrots === TOTAL_CARROTS) {
                logMessage("SUCESSO: Todas as cenouras foram coletadas!");
                setIsFinished({ status: 'success', message: 'Parabéns! Você guiou o coelho para todas as cenouras!' });
                setFailures(0);
                setShowSolution(false);
            } else {
                 const message = TOTAL_CARROTS > 0 
                    ? `Quase lá! Faltaram ${TOTAL_CARROTS - tempCollectedCarrots} cenoura(s).`
                    : 'Objetivo não alcançado. Tente novamente.';
                logMessage(`FALHA: ${message}`);
                setIsFinished({ status: 'fail', message });
                const newFailures = failures + 1;
                setFailures(newFailures);
                if (newFailures >= 3) {
                    setShowSolution(true);
                    logMessage("DICA: Parece que você está com dificuldades. Dê uma olhada no exemplo de solução!");
                }
            }
        } catch (e: any) {
            logMessage(`ERRO na execução: ${e.message}`);
             const newFailures = failures + 1;
             setFailures(newFailures);
             if (newFailures >= 3) {
                 setShowSolution(true);
                 logMessage("DICA: Parece que você está com dificuldades. Dê uma olhada no exemplo de solução!");
             }
             setIsFinished({ status: 'fail', message: e.message || 'Ocorreu um erro no seu código.' });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="bg-sky-100 p-4 rounded-lg shadow-lg border-2 border-sky-500 animate-in fade-in">
             <main className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-1/2 flex flex-col gap-4">
                     <div className="p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-start">
                             <div>
                                <h2 className="text-xl font-bold mb-2">Desafio Atual: {level.name}</h2>
                                <p className="text-sm">{level.description}</p>
                            </div>
                             <div className="text-right font-semibold text-sky-700 flex-shrink-0">
                                Cenouras: {collectedCarrots} / {TOTAL_CARROTS}
                                {failures > 0 && (
                                    <div className="text-sm font-bold text-orange-600 mt-1 animate-in fade-in">
                                        Falhas: {failures}
                                    </div>
                                )}
                             </div>
                        </div>
                        <h4 className="font-bold text-sm mt-4 mb-1">API Disponível:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside bg-gray-50 p-2 rounded">
                            <li><code>await player.moveForward()</code> - Avança o coelho uma casa.</li>
                            <li><code>await player.turnRight()</code> - Vira o coelho para a direita.</li>
                            <li><code>await player.turnLeft()</code> - Vira o coelho para a esquerda.</li>
                            <li>Use loops (<code>for</code>, <code>while</code>) para repetir ações!</li>
                        </ul>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4 bg-green-100 rounded-lg shadow-inner min-h-[300px]">
                        <div className="relative grid gap-1">
                             {grid.map((row, y) => (
                                <div key={y} className="flex gap-1">
                                    {row.map((cell, x) => (
                                        <div key={`${y}-${x}`} className={`flex items-center justify-center rounded-md text-3xl ${TILE_SIZE} ${cell === 'X' ? 'bg-green-300' : 'bg-green-200'}`}>
                                            { TILE_EMOJI[cell] }
                                        </div>
                                    ))}
                                </div>
                             ))}
                             <div 
                                className={`absolute flex items-center justify-center text-4xl transform transition-all duration-300 ease-in-out ${TILE_SIZE}`}
                                style={{
                                    top: `calc(${bunnyState.y} * (100% / ${grid.length}))`,
                                    left: `calc(${bunnyState.x} * (100% / ${grid[0].length}))`,
                                    transform: `rotate(${bunnyState.rotation}deg)`
                                }}
                            >
                                <span>🐰</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 flex flex-col gap-4">
                     <div className="flex-grow flex flex-col bg-white rounded-lg shadow min-h-[200px]">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-bold mb-2">Editor de Código (JavaScript)</h2>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleAddCommand('forward')} disabled={isRunning} className="px-3 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                                    player.moveForward()
                                </button>
                                <button onClick={() => handleAddCommand('right')} disabled={isRunning} className="px-3 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                                    player.turnRight()
                                </button>
                                 <button onClick={() => handleAddCommand('left')} disabled={isRunning} className="px-3 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                                    player.turnLeft()
                                </button>
                                <button onClick={() => handleAddCommand('loop')} disabled={isRunning} className="px-3 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                                    for loop
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={isRunning}
                            className="flex-1 p-4 font-mono text-sm bg-gray-800 text-green-300 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Escreva seu código JavaScript aqui..."
                        />
                     </div>
                     <div className="h-48 flex flex-col bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold p-4 border-b">Terminal de Execução</h2>
                        <div ref={logContainerRef} className="flex-1 p-4 font-mono text-xs text-gray-500 overflow-y-auto bg-gray-50 rounded-b-lg">
                           {logs.map((log, i) => <p key={i}>{log}</p>)}
                           {isFinished.status !== 'idle' && (
                            <div className={`mt-2 p-2 rounded font-sans font-bold text-sm animate-in fade-in ${isFinished.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {isFinished.message}
                            </div>
                           )}
                        </div>
                     </div>
                     {showSolution && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow animate-in fade-in">
                            <h3 className="text-lg font-bold text-yellow-800">Exemplo de Solução</h3>
                            <pre className="bg-gray-800 text-white p-3 rounded font-mono text-xs overflow-x-auto mt-2">
                                <code>{level.solutionCode}</code>
                            </pre>
                        </div>
                     )}
                     <div className="flex flex-col gap-2 mt-auto">
                        {isFinished.status === 'success' && (
                             <button onClick={onComplete} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                                {isLastLevel ? 'Finalizar Aventura' : 'Próximo Nível'}
                            </button>
                        )}
                         <div className="flex gap-4">
                            <button onClick={handleRunCode} disabled={isRunning} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400">
                                <PlayIcon className="w-5 h-5" /> Executar
                            </button>
                            <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
                                <ResetIcon className="w-5 h-5" /> Resetar
                            </button>
                         </div>
                     </div>
                </div>
            </main>
        </div>
    )
};


const AdventureScreen: React.FC<AdventureScreenProps> = ({ onBackToMap, initialLevel, onSaveProgress }) => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(Math.max(0, initialLevel - 1));

    const handleNextLevel = () => {
        const currentLevel = ADVENTURE_LEVELS[currentLevelIndex];
        if (!currentLevel) return;

        const nextLevelNumber = currentLevel.id + 1;
        onSaveProgress(nextLevelNumber);

        if (currentLevelIndex < ADVENTURE_LEVELS.length) {
            setCurrentLevelIndex(prev => prev + 1);
        }
    };
    
    return (
        <div className="flex flex-col h-screen bg-sky-50 text-gray-800 font-sans">
             <header className="text-center p-4 bg-white shadow-md z-10 sticky top-0">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <button onClick={onBackToMap} className="px-4 py-2 text-sky-600 font-bold rounded-lg hover:bg-sky-100 transition-colors">
                        &larr; Voltar ao Mapa
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                            Modo Aventura
                        </h1>
                    </div>
                     <div className="w-40" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                     {currentLevelIndex > 0 && (
                        <CompletedLevelCard level={ADVENTURE_LEVELS[currentLevelIndex - 1]} />
                    )}
                    
                    {currentLevelIndex < ADVENTURE_LEVELS.length ? (
                        <CurrentLevelView 
                            key={ADVENTURE_LEVELS[currentLevelIndex].id}
                            level={ADVENTURE_LEVELS[currentLevelIndex]}
                            onComplete={handleNextLevel}
                            isLastLevel={currentLevelIndex === ADVENTURE_LEVELS.length - 1}
                        />
                    ) : (
                        <div className="text-center p-8 bg-green-100 rounded-lg">
                            <h2 className="text-3xl font-bold text-green-800">Aventura Concluída!</h2>
                            <p className="text-green-700 mt-2">Você completou todos os desafios. Parabéns, Mestre dos Códigos!</p>
                            <button onClick={onBackToMap} className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                                Voltar ao Mapa
                            </button>
                        </div>
                    )}
                    
                    {currentLevelIndex + 1 < ADVENTURE_LEVELS.length && (
                        <LockedLevelCard level={ADVENTURE_LEVELS[currentLevelIndex + 1]} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdventureScreen;