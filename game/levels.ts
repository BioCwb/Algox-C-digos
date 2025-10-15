import type { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Primeiros Passos",
    grid: [
      [{ type: 'player' }, { type: 'empty' }, { type: 'goal' }],
    ],
    playerStart: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward'],
    solutionLength: 2,
  },
  {
    id: 2,
    name: "A Curva",
    grid: [
      [{ type: 'player' }, { type: 'empty' }, { type: 'empty' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'goal' }],
    ],
    playerStart: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 4,
  },
   {
    id: 3,
    name: "Pegue a Gema",
    grid: [
      [{ type: 'player' }, { type: 'empty', item: true }, { type: 'goal' }],
    ],
    playerStart: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'pickup'],
    solutionLength: 3,
  },
  {
    id: 4,
    name: "Zig-Zag",
    grid: [
      [{ type: 'player' }, { type: 'empty' }, { type: 'wall' }],
      [{ type: 'empty' }, { type: 'empty' }, { type: 'goal' }],
    ],
    playerStart: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'right', 'left'],
    solutionLength: 5,
  },
  {
    id: 5,
    name: "O Desvio",
    grid: [
      [{ type: 'player' }, { type: 'empty' }, { type: 'empty' }, { type: 'wall' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'empty' }, { type: 'goal' }],
    ],
    playerStart: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right', 'left'],
    solutionLength: 6,
  },
  {
    id: 6,
    name: "Coleta e Entrega",
    grid: [
      [{ type: 'player' }, { type: 'wall' }, { type: 'goal' }],
      [{ type: 'empty' }, { type: 'empty' }, { type: 'empty', item: true }],
    ],
    playerStart: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'right', 'left', 'pickup'],
    solutionLength: 7,
  },
  {
    id: 7,
    name: "Labirinto Simples",
    grid: [
      [{ type: 'player' }, { type: 'empty' }, { type: 'wall' }, { type: 'wall' }],
      [{ type: 'wall' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
      [{ type: 'empty' }, { type: 'empty' }, { type: 'wall' }, { type: 'goal' }],
    ],
    playerStart: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right', 'left'],
    solutionLength: 8,
  }
];
