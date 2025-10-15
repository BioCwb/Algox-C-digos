import React, { useState, useEffect, useCallback } from 'react';
import type { Level, BlockType, PlayerState, Grid, ResultState, Language, ProgramBlock, SimpleBlockType, ConditionType } from '../types';
import { executeStep, checkSuccess, checkCondition } from '../game/engine';
import { ResetIcon, TrashIcon, PlayIcon } from './Icon';
import { playBlockExecuteSound, playClearSound, playClickSound } from '../services/audioService';

interface EditorScreenProps {
  level: Level;
  onBackToMap: () => void;
  onLevelComplete: (result: ResultState) => void;
  preferredLanguage: Language;
}

const TILE_COLORS = {
  path: 'bg-gray-200',
  wall: 'bg-gray-800',
  goal: 'bg-green-500',
  start: 'bg-blue-500',
};

const PLAYER_ROTATION = {
  up: '-rotate-90',
  down: 'rotate-90',
  left: 'rotate-180',
  right: 'rotate-0',
};

const conditionTranslations: Record<ConditionType, string> = {
    pathAhead: "caminho livre à frente",
    notAtGoal: "não chegou no objetivo",
};

const EditorScreen: React.FC<EditorScreenProps> = ({ level, onBackToMap, onLevelComplete, preferredLanguage }) => {
  const [program, setProgram] = useState<ProgramBlock[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState>(level.initialPlayerState);
  const [currentGrid, setCurrentGrid] = useState<Grid>(level.grid);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const resetState = useCallback(() => {
    setPlayerState(level.initialPlayerState);
    setCurrentGrid(JSON.parse(JSON.stringify(level.grid))); // Deep copy
    setIsRunning(false);
    setActiveStep(null);
  }, [level]);

  useEffect(() => {
    resetState();
  }, [level, resetState]);

  /**
   * Runs the user's program, interpreting each block and updating the player's state.
   */
  const handleRun = async () => {
    setIsRunning(true);
    let tempPlayerState = { ...level.initialPlayerState };
    let tempGrid = JSON.parse(JSON.stringify(level.grid));

    // Iterate through the program blocks one by one.
    for (let i = 0; i < program.length; i++) {
      const block = program[i];
      setActiveStep(i);

      // --- Handle 'repeat' loops ---
      if (block.type === 'repeat') {
        const repeatCount = block.times || 0;
        const nextBlockToRepeat = program[i + 1];
        // Ensure there is a next block and it's a simple action (not another loop).
        if (nextBlockToRepeat && nextBlockToRepeat.type !== 'repeat' && nextBlockToRepeat.type !== 'while') {
          for (let j = 0; j < repeatCount; j++) {
            playBlockExecuteSound();
            await new Promise(resolve => setTimeout(resolve, 300)); // Animation delay
            const { newPlayerState, grid } = executeStep(tempPlayerState, nextBlockToRepeat.type as SimpleBlockType, tempGrid);
            tempPlayerState = newPlayerState;
            tempGrid = grid;
            // Update UI
            setPlayerState(tempPlayerState);
            setCurrentGrid(tempGrid);
          }
          i++; // Manually increment 'i' to skip the action block that was just repeated.
        }
      // --- Handle 'while' loops ---
      } else if (block.type === 'while') {
        const condition = block.condition;
        const nextBlockToRepeat = program[i + 1];
        // Ensure there's a condition and a simple action block to repeat.
        if (condition && nextBlockToRepeat && nextBlockToRepeat.type !== 'repeat' && nextBlockToRepeat.type !== 'while') {
            let safetyCounter = 0; // Prevents infinite loops.
            // Keep executing the next block as long as the condition is true.
            while(checkCondition(condition, tempPlayerState, tempGrid) && safetyCounter < 100) {
                playBlockExecuteSound();
                await new Promise(resolve => setTimeout(resolve, 300)); // Animation delay
                const { newPlayerState, grid } = executeStep(tempPlayerState, nextBlockToRepeat.type as SimpleBlockType, tempGrid);
                tempPlayerState = newPlayerState;
                tempGrid = grid;
                // Update UI
                setPlayerState(tempPlayerState);
                setCurrentGrid(tempGrid);
                safetyCounter++;
            }
            if (safetyCounter >= 100) console.warn("Loop de 'enquanto' interrompido por segurança.");
            i++; // Skip the action block that was part of the loop.
        }
      // --- Handle simple action blocks ---
      } else {
        playBlockExecuteSound();
        await new Promise(resolve => setTimeout(resolve, 300)); // Animation delay
        const { newPlayerState, grid } = executeStep(tempPlayerState, block.type as SimpleBlockType, tempGrid);
        tempPlayerState = newPlayerState;
        tempGrid = grid;
        // Update UI
        setPlayerState(tempPlayerState);
        setCurrentGrid(tempGrid);
      }
    }

    const success = checkSuccess(tempPlayerState, level);
    
    // Calculate stars based on program length compared to the optimal solution.
    let stars = 0;
    if (success) {
      if (program.length <= level.solutionLength) {
        stars = 3;
      } else if (program.length <= level.solutionLength + 2) {
        stars = 2;
      } else {
        stars = 1;
      }
    }

    // Show the result screen after a short delay.
    setTimeout(() => {
      onLevelComplete({ levelId: level.id, success, stars });
      setIsRunning(false);
      setActiveStep(null);
    }, 500);
  };

  /**
   * Adds a new block to the program list. Prompts for details if it's a loop block.
   */
  const handleAddBlock = (blockType: BlockType) => {
    playClickSound();
    // For 'repeat' blocks, prompt the user for the number of repetitions.
    if (blockType === 'repeat') {
        const timesStr = prompt("Quantas vezes repetir o próximo bloco?", "3");
        if (timesStr) {
            const times = parseInt(timesStr, 10);
            if (!isNaN(times) && times > 0 && times < 100) {
                setProgram([...program, { type: 'repeat', times }]);
            } else {
                alert("Por favor, insira um número válido.");
            }
        }
    // For 'while' blocks, prompt the user to select a condition.
    } else if (blockType === 'while') {
        const conditionInput = prompt("Digite a condição para repetir o próximo bloco:\n1 - caminhoLivre\n2 - naoChegouNoObjetivo", "1");
        let condition: ConditionType | null = null;
        if (conditionInput === '1' || conditionInput?.toLowerCase() === 'caminholivre') {
            condition = 'pathAhead';
        } else if (conditionInput === '2' || conditionInput?.toLowerCase() === 'naochegounoobjetivo') {
            condition = 'notAtGoal';
        }

        if (condition) {
            setProgram([...program, { type: 'while', condition }]);
        } else {
            alert("Condição inválida. Por favor, escolha uma das opções.");
        }
    // For simple blocks, just add them to the program.
    } else {
        setProgram([...program, { type: blockType }]);
    }
  };

  const handleClearProgram = () => {
    playClearSound();
    setProgram([]);
  };
  
  const handleReset = () => {
    playClickSound();
    resetState();
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
        <button onClick={onBackToMap} className="px-4 py-2 text-sky-600 font-bold rounded-lg hover:bg-sky-100 transition-colors">
          &larr; Voltar ao Mapa
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{level.name}</h1>
          <p className="text-gray-600">{level.description}</p>
        </div>
        <div className="w-40"></div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <main className="flex items-center justify-center p-4 md:flex-1">
          <div
            className="relative grid gap-1 bg-gray-400 p-2 rounded-lg shadow-inner"
            style={{ gridTemplateColumns: `repeat(${level.grid[0].length}, minmax(0, 1fr))` }}
          >
            {currentGrid.flat().map((tile, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded ${TILE_COLORS[tile.type]} flex items-center justify-center`}
              >
                {tile.item && <div className="w-6 h-6 bg-yellow-400 rounded-full shadow-md animate-pulse"></div>}
              </div>
            ))}
            <div
              className="absolute transition-all duration-300 ease-in-out"
              style={{
                top: `calc(0.5rem + ${playerState.y} * (4rem + 0.25rem))`,
                left: `calc(0.5rem + ${playerState.x} * (4rem + 0.25rem))`,
              }}
            >
              <div className={`w-16 h-16 flex items-center justify-center text-white text-5xl transform transition-transform duration-300 ${PLAYER_ROTATION[playerState.dir]}`}>
                <div className="drop-shadow-lg">&#10148;</div>
                {playerState.hasItem && <div className="absolute w-4 h-4 bg-yellow-400 rounded-full bottom-1 border-2 border-white"></div>}
              </div>
            </div>
          </div>
        </main>

        <aside className="flex-1 md:flex-none w-full md:w-96 bg-white p-4 overflow-y-auto flex flex-col shadow-lg border-t md:border-t-0 md:border-l border-gray-200">
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-2 text-gray-700">Seu Programa</h2>
            <div className="bg-gray-100 p-2 rounded-lg min-h-[150px] flex flex-col gap-1 text-sm border mb-4">
              {program.map((block, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-md font-medium capitalize transition-colors ${
                    activeStep === index ? 'bg-yellow-300 text-black shadow-md' : 'bg-white text-gray-800'
                  }`}
                >
                  <span className="font-mono mr-2 text-gray-500">{index + 1}.</span>
                  {block.type === 'repeat' ? `Repetir ${block.times} vezes o próximo` :
                   block.type === 'while' && block.condition ? `Enquanto (${conditionTranslations[block.condition]})` :
                   block.type}
                </div>
              ))}
              {program.length === 0 && <p className="text-gray-500 text-center p-4 m-auto">Adicione blocos aqui</p>}
            </div>
            
            <h2 className="text-lg font-bold mb-2 text-gray-700">Exemplo de Código</h2>
            <div className="bg-gray-800 text-white p-3 rounded-lg font-mono text-xs">
                <pre><code>{level.codeExamples[preferredLanguage]}</code></pre>
            </div>

          </div>
          
          <div className="mt-auto pt-4">
            <h2 className="text-lg font-bold mb-2 text-gray-700">Blocos Disponíveis</h2>
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
              {level.availableBlocks.map(blockType => (
                <button
                  key={blockType}
                  onClick={() => handleAddBlock(blockType)}
                  disabled={isRunning}
                  className="px-3 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed capitalize transition-transform transform hover:scale-105"
                >
                  {blockType}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning || program.length === 0}
                className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <PlayIcon className="w-5 h-5" /> Executar
              </button>
              <button
                onClick={handleClearProgram}
                disabled={isRunning || program.length === 0}
                title="Limpar Programa"
                className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning}
                title="Resetar"
                className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ResetIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditorScreen;