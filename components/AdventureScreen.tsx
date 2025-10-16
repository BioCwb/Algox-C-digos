import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, ResetIcon } from './Icon';

interface AdventureScreenProps {
    onBackToMap: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface BunnyState {
    pos: { x: number; y: number };
    dir: Direction;
    rotation: number;
}

const TILE_SIZE = 'w-12 h-12 md:w-16 md:h-16'; // Responsive tile size

// A solvable grid layout
const INITIAL_GRID = [
    ['S', 'P', 'P', 'P', 'C'],
    ['X', 'X', 'X', 'X', 'P'],
    ['C', 'P', 'P', 'P', 'P'],
    ['P', 'X', 'X', 'X', 'X'],
    ['P', 'P', 'P', 'P', 'C'],
];
const TOTAL_CARROTS = INITIAL_GRID.flat().filter(c => c === 'C').length;

const TILE_EMOJI: { [key: string]: string } = {
    'P': '',
    'X': '🌵', // Obstacle
    'C': '🥕', // Carrot
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

const CORRECT_SOLUTION_CODE = `// 1. Chegar na primeira cenoura (canto superior direito)
Adiante()
Adiante()
Adiante()
Adiante()

// 2. Descer até a linha da segunda cenoura
Girar()
Adiante()
Adiante()

// 3. Atravessar para pegar a segunda cenoura (canto esquerdo)
Girar()
Adiante()
Adiante()
Adiante()
Adiante()

// 4. Voltar para a coluna da direita
Girar()
Girar()
Adiante()
Adiante()
Adiante()
Adiante()

// 5. Descer para a última cenoura
Girar()
Adiante()
Adiante()
`;

const getInitialBunnyState = (): BunnyState => {
    const startPos = { x: 0, y: 0 };
    for (let y = 0; y < INITIAL_GRID.length; y++) {
        const x = INITIAL_GRID[y].indexOf('S');
        if (x !== -1) {
            startPos.x = x;
            startPos.y = y;
            break;
        }
    }
    return { pos: startPos, dir: 'RIGHT', rotation: 0 };
};

const AdventureScreen: React.FC<AdventureScreenProps> = ({ onBackToMap }) => {
    const [grid, setGrid] = useState(INITIAL_GRID);
    const [bunnyState, setBunnyState] = useState<BunnyState>(getInitialBunnyState());
    const [collectedCarrots, setCollectedCarrots] = useState(0);
    const [code, setCode] = useState('// Mova o coelho!\n// Use Adiante() e Girar()\n');
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState<{ status: 'idle' | 'success' | 'fail', message: string }>({ status: 'idle', message: '' });
    const [failures, setFailures] = useState(0);
    const [showSolution, setShowSolution] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const logMessage = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}]: ${message}`]);
    };

    const handleReset = () => {
        setIsRunning(false);
        setGrid(INITIAL_GRID);
        setBunnyState(getInitialBunnyState());
        setCollectedCarrots(0);
        setLogs([]);
        setIsFinished({ status: 'idle', message: '' });
        setFailures(0);
        setShowSolution(false);
    };

    const handleRunCode = async () => {
        // Soft reset for re-running
        setIsRunning(true);
        setGrid(INITIAL_GRID);
        setBunnyState(getInitialBunnyState());
        setCollectedCarrots(0);
        setLogs([]);
        setIsFinished({ status: 'idle', message: '' });

        logMessage("Execução iniciada...");

        const commands = code.match(/(adiante|girar)\s*\(\s*\)/gi) || [];
        if (commands.length === 0) {
            logMessage("Nenhum comando válido encontrado.");
            setIsFinished({ status: 'fail', message: "Nenhum comando válido foi encontrado no seu código." });
            setIsRunning(false);
            return;
        }

        let tempBunnyState = getInitialBunnyState();
        let tempGrid = JSON.parse(JSON.stringify(INITIAL_GRID));
        let tempCollectedCarrots = 0;

        for (const command of commands) {
            await new Promise(resolve => setTimeout(resolve, 400));
            const cleanCommand = command.toLowerCase().replace(/[^a-z]/g, "");

            if (cleanCommand === 'girar') {
                logMessage("Comando: Girar()");
                const directions: Direction[] = ['RIGHT', 'DOWN', 'LEFT', 'UP'];
                const currentDirIndex = directions.indexOf(tempBunnyState.dir);
                const nextDir = directions[(currentDirIndex + 1) % 4];
                tempBunnyState = { ...tempBunnyState, dir: nextDir, rotation: ROTATION_MAP[nextDir] };
                setBunnyState(tempBunnyState);
            } else if (cleanCommand === 'adiante') {
                logMessage("Comando: Adiante()");
                const { x: dx, y: dy } = DIRECTION_VECTORS[tempBunnyState.dir];
                const nextPos = { x: tempBunnyState.pos.x + dx, y: tempBunnyState.pos.y + dy };

                if (
                    nextPos.y < 0 || nextPos.y >= tempGrid.length ||
                    nextPos.x < 0 || nextPos.x >= tempGrid[0].length ||
                    tempGrid[nextPos.y][nextPos.x] === 'X'
                ) {
                    logMessage("ERRO: Coelho bateu em um obstáculo!");
                    const newFailures = failures + 1;
                    setFailures(newFailures);
                     if (newFailures >= 3) {
                        setShowSolution(true);
                        logMessage("DICA: Parece que você está com dificuldades. Dê uma olhada no exemplo de solução!");
                    }
                    setIsFinished({ status: 'fail', message: 'O coelho bateu em um obstáculo! Tente novamente.' });
                    setIsRunning(false);
                    return;
                }
                
                tempBunnyState = { ...tempBunnyState, pos: nextPos };
                setBunnyState(tempBunnyState);

                if (tempGrid[nextPos.y][nextPos.x] === 'C') {
                    tempCollectedCarrots++;
                    logMessage(`Cenoura coletada! (${tempCollectedCarrots}/${TOTAL_CARROTS})`);
                    tempGrid[nextPos.y][nextPos.x] = 'P'; // Remove carrot
                    setGrid(JSON.parse(JSON.stringify(tempGrid))); // Deep copy to trigger re-render
                    setCollectedCarrots(tempCollectedCarrots);
                }
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (tempCollectedCarrots === TOTAL_CARROTS) {
            logMessage("SUCESSO: Todas as cenouras foram coletadas!");
            setIsFinished({ status: 'success', message: 'Parabéns! Você guiou o coelho para todas as cenouras!' });
            setFailures(0);
            setShowSolution(false);
        } else {
            logMessage(`FALHA: Apenas ${tempCollectedCarrots} de ${TOTAL_CARROTS} cenouras foram coletadas.`);
            setIsFinished({ status: 'fail', message: `Quase lá! Faltaram ${TOTAL_CARROTS - tempCollectedCarrots} cenoura(s).` });
            const newFailures = failures + 1;
            setFailures(newFailures);
            if (newFailures >= 3) {
                setShowSolution(true);
                logMessage("DICA: Parece que você está com dificuldades. Dê uma olhada no exemplo de solução!");
            }
        }

        setIsRunning(false);
    };

    return (
        <div className="flex flex-col h-screen bg-sky-50 text-gray-800 font-sans">
             <header className="text-center p-4 bg-white shadow-md z-10">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <button onClick={onBackToMap} className="px-4 py-2 text-sky-600 font-bold rounded-lg hover:bg-sky-100 transition-colors">
                        &larr; Voltar ao Mapa
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                            Desafio do Coelho Programador
                        </h1>
                    </div>
                     <div className="w-40 text-right"></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
                {/* Left Panel: Instructions & Grid */}
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Sua Missão</h2>
                        <p className="text-sm">
                            O coelhinho precisa pegar todas as <strong>{TOTAL_CARROTS} cenouras</strong>. Escreva um algoritmo para guiá-lo pelo caminho certo, evitando os cactos 🌵.
                        </p>
                        <ul className="text-sm mt-2 list-disc list-inside bg-gray-50 p-2 rounded">
                            <li><code>Adiante()</code> - Avança uma posição.</li>
                            <li><code>Girar()</code> - Vira 90° para a direita (sentido horário).</li>
                        </ul>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4 bg-green-100 rounded-lg shadow-inner">
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
                                    top: `calc(${bunnyState.pos.y} * (100% / ${grid.length}))`,
                                    left: `calc(${bunnyState.pos.x} * (100% / ${grid[0].length}))`,
                                    transform: `rotate(${bunnyState.rotation}deg)`
                                }}
                            >
                                <span>🐰</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Editor & Logs */}
                <div className="lg:w-1/2 flex flex-col gap-4 overflow-y-auto">
                     <div className="flex-grow flex flex-col bg-white rounded-lg shadow min-h-[200px]">
                        <h2 className="text-xl font-bold p-4 border-b">Editor de Código</h2>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={isRunning}
                            className="flex-1 p-4 font-mono text-sm bg-gray-800 text-green-300 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Escreva seus comandos aqui..."
                        />
                     </div>
                     <div className="h-48 flex flex-col bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold p-4 border-b">Terminal de Execução</h2>
                        <div ref={logContainerRef} className="flex-1 p-4 font-mono text-xs text-gray-500 overflow-y-auto bg-gray-50 rounded-b-lg">
                           {logs.map((log, i) => <p key={i}>{log}</p>)}
                           {isFinished.status !== 'idle' && (
                            <div className={`mt-2 p-2 rounded font-sans font-bold text-sm ${isFinished.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {isFinished.message}
                            </div>
                           )}
                        </div>
                     </div>
                     {showSolution && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow animate-in fade-in">
                            <h3 className="text-lg font-bold text-yellow-800">Exemplo de Solução</h3>
                            <p className="text-sm text-yellow-700 mb-2">
                                Aqui está um exemplo de código que resolve o desafio. Tente entender a lógica!
                            </p>
                            <pre className="bg-gray-800 text-white p-3 rounded font-mono text-xs overflow-x-auto">
                                <code>{CORRECT_SOLUTION_CODE}</code>
                            </pre>
                        </div>
                     )}
                     <div className="flex gap-4 mt-auto">
                        <button onClick={handleRunCode} disabled={isRunning} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400">
                            <PlayIcon className="w-5 h-5" /> Executar
                        </button>
                        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
                            <ResetIcon className="w-5 h-5" /> Resetar Desafio
                        </button>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default AdventureScreen;
