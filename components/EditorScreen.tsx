
import React, { useState, useEffect, useMemo } from 'react';
import type { Level, BlockType, PlayerState, Grid, ResultState } from '../types';
import { executeStep, checkSuccess } from '../game/engine';
import { PlayIcon, ResetIcon, TrashIcon, MapIcon } from './Icon';
import { playClickSound, playBlockExecuteSound, playClearSound } from '../services/audioService';

const BLOCK_META: { [key in BlockType]: { label: string; color: string } } = {
  forward: { label: 'Avançar', color: 'bg-blue-500' },
  left: { label: 'Virar ⬅️', color: 'bg-green-500' },
  right: { label: 'Virar ➡️', color: 'bg-yellow-500' },
  pickup: { label: 'Pegar 💎', color: 'bg-purple-500' },
};

const Player: React.FC<{ dir: PlayerState['dir'] }> = ({ dir }) => {
    const rotation = { up: '-rotate-90', right: 'rotate-0', down: 'rotate-90', left: 'rotate-180' }[dir];
    return <div className={`w-3/4 h-3/4 rounded-md bg-orange-500 transition-transform transform ${rotation} flex items-center justify-end p-1 text-white shadow-inner`}><div className="w-1/3 h-1/3 bg-orange-200 rounded-sm"></div></div>;
};

const EditorScreen: React.FC<{ level: Level; onBackToMap: () => void; onLevelComplete: (result: ResultState) => void; }> = 
({ level, onBackToMap, onLevelComplete }) => {
  const [workspace, setWorkspace] = useState<BlockType[]>([]);
  const [player, setPlayer] = useState<PlayerState>(level.playerStart);
  const [grid, setGrid] = useState<Grid>(level.grid);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState<number | null>(null);

  const displayGrid = useMemo(() => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length; c++) {
        if (newGrid[r][c].type === 'player') newGrid[r][c].type = 'empty';
      }
    }
    newGrid[player.y][player.x].type = 'player';
    return newGrid;
  }, [player, grid]);

  const reset = () => {
    setPlayer(level.playerStart);
    setGrid(level.grid);
    setIsExecuting(false);
    setExecutionStep(null);
  };
  
  useEffect(reset, [level]);

  const addBlock = (block: BlockType) => {
    if (isExecuting) return;
    playClickSound();
    setWorkspace([...workspace, block]);
  };

  const clearWorkspace = () => {
    if (isExecuting) return;
    if (workspace.length > 0) {
      playClearSound();
      setWorkspace([]);
    }
  };
  
  const handleReset = () => {
    if (isExecuting) return;
    playClickSound();
    reset();
  };

  const runCode = () => {
    if (isExecuting) return;
    playClickSound();
    reset();
    setIsExecuting(true);
    let currentStep = 0;
    let currentPlayer = level.playerStart;
    let currentGrid = level.grid;

    const interval = setInterval(() => {
      if (currentStep >= workspace.length) {
        clearInterval(interval);
        const success = checkSuccess(currentPlayer, level);
        const stars = success ? (workspace.length <= level.solutionLength ? 3 : workspace.length <= level.solutionLength + 2 ? 2 : 1) : 0;
        setTimeout(() => {
          onLevelComplete({ levelId: level.id, stars, success });
          setIsExecuting(false);
          setExecutionStep(null);
        }, 500);
        return;
      }
      
      playBlockExecuteSound();
      setExecutionStep(currentStep);
      const { newPlayerState, grid: newGrid } = executeStep(currentPlayer, workspace[currentStep], currentGrid);
      currentPlayer = newPlayerState;
      currentGrid = newGrid;
      setPlayer(currentPlayer);
      setGrid(currentGrid);
      currentStep++;
    }, 500);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left side: Editor */}
      <div className="w-full md:w-1/3 flex flex-col p-4 bg-white shadow-lg z-10">
        <div className="flex items-center justify-between mb-4">
            <button onClick={onBackToMap} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold">
                <MapIcon className="w-5 h-5" />
                <span>Mapa</span>
            </button>
            <h2 className="text-xl font-bold text-gray-800">Nível {level.id}: {level.name}</h2>
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-gray-600">Blocos</h3>
          <div className="flex flex-wrap gap-2">
            {level.availableBlocks.map(blockType => (
              <button key={blockType} onClick={() => addBlock(blockType)} disabled={isExecuting} className={`px-3 py-2 text-white font-semibold rounded-md shadow transform transition-transform hover:scale-105 ${BLOCK_META[blockType].color} disabled:opacity-50 disabled:hover:scale-100`}>
                {BLOCK_META[blockType].label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-grow bg-gray-100 rounded-lg p-2 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-600">Programa</h3>
                <button onClick={clearWorkspace} disabled={isExecuting || workspace.length === 0} className="p-1 text-gray-500 hover:text-red-500 disabled:text-gray-300">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
          <div className="flex-grow overflow-y-auto space-y-1 p-1">
            {workspace.map((block, index) => (
              <div key={index} className={`p-2 text-white rounded text-sm shadow-sm transition-all ${BLOCK_META[block].color} ${executionStep === index ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}`}>
                {index+1}. {BLOCK_META[block].label}
              </div>
            ))}
            {workspace.length === 0 && <p className="text-gray-400 text-center text-sm italic mt-4">Clique nos blocos para adicioná-los aqui.</p>}
          </div>
        </div>
      </div>
      
      {/* Right side: Game */}
      <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-4 bg-gray-200">
        <div className="bg-gray-800 p-2 rounded-lg shadow-inner" style={{display: 'grid', gridTemplateColumns: `repeat(${level.grid[0].length}, 4rem)`, gap: '0.25rem'}}>
          {displayGrid.flat().map((tile, index) => (
            <div key={index} className="w-16 h-16 rounded flex items-center justify-center bg-gray-600">
              {tile.type === 'goal' && <div className="w-10 h-10 rounded-full bg-green-500/80 animate-pulse border-4 border-green-400"></div>}
              {tile.type === 'player' && <Player dir={player.dir} />}
              {tile.item && <div className="text-2xl animate-pulse">💎</div>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-4">
          <button onClick={handleReset} disabled={isExecuting} className="px-6 py-3 bg-white text-gray-800 font-bold rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2">
            <ResetIcon className="w-5 h-5"/> Resetar
          </button>
          <button onClick={runCode} disabled={isExecuting || workspace.length === 0} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 disabled:opacity-50 disabled:bg-green-300 flex items-center gap-2">
            <PlayIcon className="w-5 h-5 fill-white"/> Executar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorScreen;