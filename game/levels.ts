import type { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "O Início",
    description: "Use o bloco 'avançar' para chegar ao objetivo.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward'],
    solutionLength: 3,
    codeExamples: {
        javascript: `// Mover 3 vezes para frente\nfor (let i = 0; i < 3; i++) {\n  player.moveForward();\n}`,
        python: `# Mover 3 vezes para frente\nfor _ in range(3):\n  player.move_forward()`,
        cpp: `// Mover 3 vezes para frente\nfor (int i = 0; i < 3; ++i) {\n  player.moveForward();\n}`,
    }
  },
  {
    id: 2,
    name: "A Curva",
    description: "Use os blocos de virar para mudar de direção.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'goal' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 5,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 3,
    name: "Coleta",
    description: "Pegue o item antes de ir para o objetivo.",
    grid: [
        [{ type: 'start' }, { type: 'path', item: true }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'pickup'],
    solutionLength: 4,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.pickupItem();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.pickup_item()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.pickupItem();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
    {
    id: 4,
    name: "Labirinto Simples",
    description: "Navegue pelo labirinto para alcançar o seu objetivo.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 7,
    codeExamples: {
        javascript: `player.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();`,
        python: `player.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()`,
        cpp: `player.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();`,
    }
  }
];
