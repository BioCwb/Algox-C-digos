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
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 8,
    codeExamples: {
        javascript: `player.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 5,
    name: "O Contorno",
    description: "Às vezes, o caminho mais longo é o único caminho.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right', 'left'],
    solutionLength: 7,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();`,
    }
  },
  {
    id: 6,
    name: "Escadaria",
    description: "Suba os degraus, um passo de cada vez.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 6,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 7,
    name: "Coleta e Entrega",
    description: "Não se esqueça do item importante!",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path', item: true }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'pickup'],
    solutionLength: 5,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.pickup_item()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 8,
    name: "O 'U'",
    description: "Vire na hora certa para não bater na parede.",
    grid: [
        [{ type: 'start' }, { type: 'wall' }, { type: 'goal' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 6,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
    }
  },
  {
    id: 9,
    name: "Caminho Estreito",
    description: "Cuidado para não cair para os lados... espere, não tem como cair.",
    grid: [
        [{ type: 'start' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 12,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
    }
  },
  {
    id: 10,
    name: "O Desvio",
    description: "Pegue o item e depois encontre o seu destino.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'path', item: true }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 8,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnLeft();\nplayer.turnLeft();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.pickup_item()\nplayer.turn_left()\nplayer.turn_left()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnLeft();\nplayer.turnLeft();\nplayer.moveForward();`,
    }
  },
  {
    id: 11,
    name: "Espirale",
    description: "Continue virando para chegar ao centro.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'goal' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 9,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_right()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();`,
    }
  },
  {
    id: 12,
    name: "Vai e Volta",
    description: "Um passo pra frente, um passo para o lado.",
    grid: [
        [{ type: 'start' }, { type: 'wall' }],
        [{ type: 'path' }, { type: 'wall' }],
        [{ type: 'path' }, { type: 'path' }],
        [{ type: 'wall' }, { type: 'path' }],
        [{ type: 'goal' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 7,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 13,
    name: "O Pilar",
    description: "Contorne o obstáculo no centro.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 6,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_left()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();`,
    }
  },
  {
    id: 14,
    name: "Chave e Fechadura",
    description: "Pegue a 'chave' (o item) para destravar o caminho para o objetivo.",
    grid: [
        [{ type: 'start' }, { type: 'wall' }, { type: 'path', item: true }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'goal' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 8,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnLeft();\nplayer.turnLeft();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.pickup_item()\nplayer.turn_left()\nplayer.turn_left()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnLeft();\nplayer.turnLeft();\nplayer.moveForward();`,
    }
  },
  {
    id: 15,
    name: "Slalom",
    description: "Desvie dos obstáculos em seu caminho.",
    grid: [
        [{ type: 'start' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 10,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 16,
    name: "Decisão Dupla",
    description: "Qual caminho seguir? Apenas um leva ao tesouro.",
    grid: [
        [{ type: 'path' }, { type: 'path' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'start' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 2, dir: 'up', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 10,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.pickup_item()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
    }
  },
  {
    id: 17,
    name: "A Grande Volta",
    description: "Um longo percurso para um pequeno passo.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 11,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
    }
  },
  {
    id: 18,
    name: "Becos",
    description: "Não entre em um caminho sem saída!",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 7,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();`,
    }
  },
  {
    id: 19,
    name: "A Fortaleza",
    description: "Encontre a entrada para o objetivo bem guardado.",
    grid: [
        [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'goal' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 3, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 9,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.turnRight();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.turn_right()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.turnRight();\nplayer.moveForward();`,
    }
  },
  {
    id: 20,
    name: "A Ilha",
    description: "Pegue o tesouro da ilha e volte para o objetivo.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'path', item: true }, { type: 'path' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 10,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();`,
        python: `player.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.pickup_item()\nplayer.turn_left()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.turn_right()`,
        cpp: `player.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();`,
    }
  },
  {
    id: 21,
    name: "A Longa Marcha",
    description: "Use um loop para atravessar o corredor rapidamente.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward'],
    solutionLength: 6,
    codeExamples: {
        javascript: `for (let i = 0; i < 6; i++) {\n  player.moveForward();\n}`,
        python: `for _ in range(6):\n  player.move_forward()`,
        cpp: `for (int i = 0; i < 6; ++i) {\n  player.moveForward();\n}`,
    }
  },
  {
    id: 22,
    name: "Quadrado Perfeito",
    description: "Ande em um quadrado. Pense em repetição.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'wall' }, { type: 'goal' }, { type: 'path' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 8,
    codeExamples: {
        javascript: `// Repita 4 vezes:\n//   Mover para frente 3 vezes\n//   Virar à direita\n// Este código é apenas um exemplo do padrão.\nplayer.moveForward(); // ...`,
        python: `# Repita 4 vezes:\n#   Mover para frente 3 vezes\n#   Virar à direita\n# Este código é apenas um exemplo do padrão.\nplayer.move_forward() # ...`,
        cpp: `// Repita 4 vezes:\n//   Mover para frente 3 vezes\n//   Virar à direita\n// Este código é apenas um exemplo do padrão.\nplayer.moveForward(); // ...`,
    }
  },
  {
    id: 23,
    name: "Cortando a Grama",
    description: "Limpe o campo em um padrão de vai e vem.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'goal' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 9,
    codeExamples: {
        javascript: `// Pense em como otimizar o movimento de vaivém.\nfor (let i = 0; i < 3; i++) {\n  player.moveForward();\n}\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\n// ...`,
        python: `# Pense em como otimizar o movimento de vaivém.\nfor _ in range(3):\n  player.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_right()\n# ...`,
        cpp: `// Pense em como otimizar o movimento de vaivém.\nfor (int i = 0; i < 3; ++i) {\n  player.moveForward();\n}\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\n// ...`,
    }
  },
  {
    id: 24,
    name: "Escada Rolante",
    description: "O padrão se repete. Você consegue enxergá-lo?",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 10,
    codeExamples: {
        javascript: `// O padrão é: avançar, virar à direita, avançar, virar à esquerda\n// Repita isso para vencer!\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\n// ...`,
        python: `# O padrão é: avançar, virar à direita, avançar, virar à esquerda\n# Repita isso para vencer!\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\n# ...`,
        cpp: `// O padrão é: avançar, virar à direita, avançar, virar à esquerda\n// Repita isso para vencer!\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\n// ...`,
    }
  },
  {
    id: 25,
    name: "Coleta em Série",
    description: "Pegue todos os itens no caminho.",
    grid: [
        [{ type: 'start' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path', item: true }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'pickup'],
    solutionLength: 6,
    codeExamples: {
        javascript: `player.moveForward();\nplayer.pickupItem();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.moveForward();`,
        python: `player.move_forward()\nplayer.pickup_item()\nplayer.move_forward()\nplayer.move_forward()\nplayer.pickup_item()\nplayer.move_forward()`,
        cpp: `player.moveForward();\nplayer.pickupItem();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\nplayer.moveForward();`,
    }
  },
  {
    id: 26,
    name: "Pente",
    description: "Entre e saia de cada 'dente' do pente.",
    grid: [
        [{ type: 'start' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
        [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 1, dir: 'up', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 15,
    codeExamples: {
        javascript: `// Pense em um padrão repetitivo para cada dente.\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft(); // ...`,
        python: `# Pense em um padrão repetitivo para cada dente.\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left() # ...`,
        cpp: `// Pense em um padrão repetitivo para cada dente.\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft(); // ...`,
    }
  },
  {
    id: 27,
    name: "Onda",
    description: "Siga o fluxo da onda.",
    grid: [
      [{ type: 'start' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 13,
    codeExamples: {
      javascript: `// O padrão é repetitivo, encontre a sequência que se repete!\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft(); // ...`,
      python: `# O padrão é repetitivo, encontre a sequência que se repete!\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left() # ...`,
      cpp: `// O padrão é repetitivo, encontre a sequência que se repete!\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft(); // ...`,
    },
  },
  {
    id: 28,
    name: "Patrulha",
    description: "Patrulhe o perímetro para encontrar a entrada.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'wall' }, { type: 'goal' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right'],
    solutionLength: 14,
    codeExamples: {
      javascript: `// Andar em volta do quadrado é um loop.\nfor(let i=0; i<4; i++) {\n  player.moveForward();\n  player.moveForward();\n  player.turnRight();\n}`,
      python: `# Andar em volta do quadrado é um loop.\nfor _ in range(4):\n  player.move_forward()\n  player.move_forward()\n  player.turn_right()`,
      cpp: `// Andar em volta do quadrado é um loop.\nfor(int i=0; i<4; ++i) {\n  player.moveForward();\n  player.moveForward();\n  player.turnRight();\n}`,
    },
  },
  {
    id: 29,
    name: "Busca Vertical",
    description: "Verifique cada corredor.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
      [{ type: 'goal' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 13,
    codeExamples: {
      javascript: `// Você precisará ir e voltar em alguns corredores.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft(); // ...`,
      python: `# Você precisará ir e voltar em alguns corredores.\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left() # ...`,
      cpp: `// Você precisará ir e voltar em alguns corredores.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft(); // ...`,
    },
  },
  {
    id: 30,
    name: "Otimização",
    description: "Qual o caminho mais curto? Pense antes de se mover.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 8,
    codeExamples: {
      javascript: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
      python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()`,
      cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();`,
    },
  },
  {
    id: 31,
    name: "Guardião",
    description: "O item está guardado. Encontre uma forma de pegá-lo.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 11,
    codeExamples: {
      javascript: `// O caminho para o item exige um grande desvio.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\n//... e agora, como voltar?`,
      python: `player.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.move_forward()\nplayer.pickup_item()\n#... e agora, como voltar?`,
      cpp: `player.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.moveForward();\nplayer.pickupItem();\n//... e agora, como voltar?`,
    },
  },
  {
    id: 32,
    name: "Volta Necessária",
    description: "Às vezes, é preciso voltar para poder avançar.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path', item: true }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'goal' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 10,
    codeExamples: {
      javascript: `// Pegue o item e encontre o caminho de volta.\nplayer.moveForward(); // ...`,
      python: `# Pegue o item e encontre o caminho de volta.\nplayer.move_forward() # ...`,
      cpp: `// Pegue o item e encontre o caminho de volta.\nplayer.moveForward(); // ...`,
    },
  },
  {
    id: 33,
    name: "O Sacrifício",
    description: "Um caminho parece mais curto, mas sem o item, é inútil.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }],
      [{ type: 'path' }, { type: 'path', item: true }, { type: 'path' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 9,
    codeExamples: {
      javascript: `// Ignore o caminho óbvio no início.\nplayer.turnRight();\nplayer.turnRight(); // ...`,
      python: `# Ignore o caminho óbvio no início.\nplayer.turn_right()\nplayer.turn_right() # ...`,
      cpp: `// Ignore o caminho óbvio no início.\nplayer.turnRight();\nplayer.turnRight(); // ...`,
    },
  },
  {
    id: 34,
    name: "A Chave Distante",
    description: "O item está longe, mas é essencial.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
      [{ type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'wall' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 10,
    codeExamples: {
      javascript: `player.turnRight();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.pickupItem(); //...`,
      python: `player.turn_right()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.pickup_item() #...`,
      cpp: `player.turnRight();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.pickupItem(); //...`,
    },
  },
  {
    id: 35,
    name: "Labirinto do Tesouro",
    description: "Encontre o item no labirinto e depois a saída.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'wall' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 9,
    codeExamples: {
      javascript: `player.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.pickupItem(); //...`,
      python: `player.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.pickup_item() #...`,
      cpp: `player.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.pickupItem(); //...`,
    },
  },
  {
    id: 36,
    name: "Caminho Duplo",
    description: "Colete o item e retorne pelo outro caminho.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'goal' }],
      [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
      [{ type: 'path', item: true }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 13,
    codeExamples: {
        javascript: `// Pegar o item exige um longo desvio.\nplayer.turnRight(); // ...`,
        python: `# Pegar o item exige um longo desvio.\nplayer.turn_right() # ...`,
        cpp: `// Pegar o item exige um longo desvio.\nplayer.turnRight(); // ...`,
    }
  },
  {
    id: 37,
    name: "Loop Quebrado",
    description: "Um padrão quase perfeito. Adapte sua estratégia.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
      [{ type: 'goal' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 8,
    codeExamples: {
        javascript: `// Quase um loop, mas a última parte é diferente.\nplayer.moveForward();\nplayer.turnRight(); // ...`,
        python: `# Quase um loop, mas a última parte é diferente.\nplayer.move_forward()\nplayer.turn_right() # ...`,
        cpp: `// Quase um loop, mas a última parte é diferente.\nplayer.moveForward();\nplayer.turnRight(); // ...`,
    }
  },
  {
    id: 38,
    name: "A Escolha",
    description: "Dois itens, mas você só precisa de um. Qual é o mais eficiente?",
    grid: [
      [{ type: 'path', item: true }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path', item: true }],
      [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'start' }, { type: 'wall' }, { type: 'wall' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'goal' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 2, y: 2, dir: 'up', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 7,
    codeExamples: {
        javascript: `// Analise os dois caminhos. Qual leva ao objetivo mais rápido?\nplayer.moveForward();\nplayer.turnLeft(); //...`,
        python: `# Analise os dois caminhos. Qual leva ao objetivo mais rápido?\nplayer.move_forward()\nplayer.turn_left() #...`,
        cpp: `// Analise os dois caminhos. Qual leva ao objetivo mais rápido?\nplayer.moveForward();\nplayer.turnLeft(); //...`,
    }
  },
  {
    id: 39,
    name: "Coleta em Loop",
    description: "Use um padrão repetitivo para coletar todos os itens.",
    grid: [
      [{ type: 'start' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path', item: true }, { type: 'path' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'goal' }, { type: 'path', item: true }, { type: 'path' }, { type: 'path', item: true }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 17,
    codeExamples: {
        javascript: `// O padrão para coletar é repetitivo. Encontre-o!\nplayer.moveForward();\nplayer.pickupItem(); //...`,
        python: `# O padrão para coletar é repetitivo. Encontre-o!\nplayer.move_forward()\nplayer.pickup_item() #...`,
        cpp: `// O padrão para coletar é repetitivo. Encontre-o!\nplayer.moveForward();\nplayer.pickupItem(); //...`,
    }
  },
  {
    id: 40,
    name: "Pinça",
    description: "Entre, pegue e saia com cuidado.",
    grid: [
        [{type: 'start'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'goal'}],
        [{type: 'wall'}, {type: 'path'}, {type: 'path', item: true}, {type: 'path'}, {type: 'wall'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 12,
    codeExamples: {
        javascript: `// É uma manobra delicada.\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.pickupItem(); // ...`,
        python: `# É uma manobra delicada.\nplayer.move_forward()\nplayer.turn_right()\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.pickup_item() # ...`,
        cpp: `// É uma manobra delicada.\nplayer.moveForward();\nplayer.turnRight();\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.pickupItem(); // ...`,
    }
  },
  {
    id: 41,
    name: "Onda Invertida",
    description: "O mesmo padrão, mas com um novo ponto de partida.",
    grid: [
      [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'start' }],
      [{ type: 'goal' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }, { type: 'wall' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 6, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 13,
    codeExamples: {
        javascript: `// Encontre a sequência que se repete!\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight(); // ...`,
        python: `# Encontre a sequência que se repete!\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward()\nplayer.turn_right() # ...`,
        cpp: `// Encontre a sequência que se repete!\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward();\nplayer.turnRight(); // ...`,
    },
  },
  {
    id: 42,
    name: "Zig-Zag Duplo",
    description: "Um caminho de ida e volta.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
      [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'goal' }, { type: 'path' }, { type: 'path', item: true }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 11,
    codeExamples: {
        javascript: `// Pegue o item no final antes de seguir para o objetivo.\nplayer.moveForward(); // ...`,
        python: `# Pegue o item no final antes de seguir para o objetivo.\nplayer.move_forward() # ...`,
        cpp: `// Pegue o item no final antes de seguir para o objetivo.\nplayer.moveForward(); // ...`,
    },
  },
  {
    id: 43,
    name: "A Ponte",
    description: "Atravesse a ponte com cuidado para pegar o item.",
    grid: [
      [{ type: 'start' }, { type: 'wall' }, { type: 'wall' }, { type: 'path', item: true }, { type: 'wall' }],
      [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }],
      [{ type: 'goal' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'down', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 8,
    codeExamples: {
        javascript: `// O caminho é linear, mas exige planejamento.\nplayer.moveForward();\nplayer.turnRight(); // ...`,
        python: `# O caminho é linear, mas exige planejamento.\nplayer.move_forward()\nplayer.turn_right() # ...`,
        cpp: `// O caminho é linear, mas exige planejamento.\nplayer.moveForward();\nplayer.turnRight(); // ...`,
    },
  },
  {
    id: 44,
    name: "Quatro Cantos",
    description: "Visite os quatro cantos para pegar tudo.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path', item: true }],
      [{ type: 'path' }, { type: 'wall' }, { type: 'path' }],
      [{ type: 'path', item: true }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 10,
    codeExamples: {
        javascript: `// Qual a ordem mais eficiente para pegar os itens?\nplayer.moveForward();\nplayer.pickupItem(); // ...`,
        python: `# Qual a ordem mais eficiente para pegar os itens?\nplayer.move_forward()\nplayer.pickup_item() # ...`,
        cpp: `// Qual a ordem mais eficiente para pegar os itens?\nplayer.moveForward();\nplayer.pickupItem(); // ...`,
    },
  },
  {
    id: 45,
    name: "O Desfiladeiro",
    description: "Um caminho estreito com um prêmio no meio.",
    grid: [
      [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
      [{ type: 'wall' }, { type: 'wall' }, { type: 'path', item: true }, { type: 'wall' }, { type: 'wall' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 8,
    codeExamples: {
        javascript: `// O desvio vale a pena.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight(); // ...`,
        python: `# O desvio vale a pena.\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right() # ...`,
        cpp: `// O desvio vale a pena.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight(); // ...`,
    },
  },
  {
    id: 46,
    name: "A Longa Estrada",
    description: "Use o bloco 'repeat' para atravessar este longo caminho.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'repeat'],
    solutionLength: 2, // repeat + forward
    codeExamples: {
        javascript: `// Usar um loop é muito mais eficiente!\nfor (let i = 0; i < 6; i++) {\n  player.moveForward();\n}`,
        python: `# Usar um loop é muito mais eficiente!\nfor _ in range(6):\n  player.move_forward()`,
        cpp: `// Usar um loop é muito mais eficiente!\nfor (int i = 0; i < 6; ++i) {\n  player.moveForward();\n}`,
    }
  },
  {
    id: 47,
    name: "Fazendo Quadrados",
    description: "Um caminho quadrado requer um padrão repetitivo de movimentos e curvas.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }],
        [{ type: 'goal' }, { type: 'path' }, { type: 'path' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'right', 'repeat'],
    solutionLength: 7, // repeat 2, fwd, right, repeat 2, fwd, right, repeat 2, fwd
    codeExamples: {
        javascript: `// O padrão é avançar 2 vezes e virar.\n// Repita isso para formar o quadrado.\nfor (let i = 0; i < 2; i++) {\n  player.moveForward();\n}\nplayer.turnRight();\n// ...`,
        python: `# O padrão é avançar 2 vezes e virar.\n# Repita isso para formar o quadrado.\nfor _ in range(2):\n  player.move_forward()\nplayer.turn_right()\n# ...`,
        cpp: `// O padrão é avançar 2 vezes e virar.\n// Repita isso para formar o quadrado.\nfor (int i = 0; i < 2; ++i) {\n  player.moveForward();\n}\nplayer.turnRight();\n// ...`,
    }
  },
  {
    id: 48,
    name: "Escadaria para o Sucesso",
    description: "O padrão se repete. Você consegue enxergá-lo e usar 'repeat'?",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'path' }, { type: 'wall' }],
        [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'left', 'right', 'repeat'],
    solutionLength: 6,
    codeExamples: {
        javascript: `// O padrão é: avançar, virar dir., avançar, virar esq.\n// Tente usar 'repeat' para otimizar!\nplayer.moveForward();\nplayer.turnRight();\n//...`,
        python: `# O padrão é: avançar, virar dir., avançar, virar esq.\n# Tente usar 'repeat' para otimizar!\nplayer.move_forward()\nplayer.turn_right()\n#...`,
        cpp: `// O padrão é: avançar, virar dir., avançar, virar esq.\n// Tente usar 'repeat' para otimizar!\nplayer.moveForward();\nplayer.turnRight();\n//...`,
    }
  },
  {
    id: 49,
    name: "A Ponte Nebulosa",
    description: "Você não vê o fim do caminho. Avance até o objetivo.",
    grid: [
        [{ type: 'start' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'goal' }],
    ],
    initialPlayerState: { x: 0, y: 0, dir: 'right', hasItem: false },
    availableBlocks: ['forward', 'while'],
    solutionLength: 2,
    codeExamples: {
        javascript: `// Quando não se sabe o fim, use 'while'.\nwhile (player.isNotAtGoal()) {\n  player.moveForward();\n}`,
        python: `# Quando não se sabe o fim, use 'while'.\nwhile player.is_not_at_goal():\n  player.move_forward()`,
        cpp: `// Quando não se sabe o fim, use 'while'.\nwhile (player.isNotAtGoal()) {\n  player.moveForward();\n}`,
    }
  },
  {
    id: 50,
    name: "Labirinto Sinuoso",
    description: "O caminho é longo e cheio de curvas. Use 'enquanto' para avançar nas retas e vire quando necessário.",
    grid: [
        [{type: 'start'}, {type: 'path'}, {type: 'path'}],
        [{type: 'wall'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'goal'}, {type: 'path'}, {type: 'path'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'left', 'right', 'while'],
    solutionLength: 8,
    codeExamples: {
        javascript: `// Use 'while' nas retas para simplificar!\nwhile(player.hasPathAhead()) {\n  player.moveForward();\n}\nplayer.turnRight();\n// ... continue o padrão`,
        python: `# Use 'while' nas retas para simplificar!\nwhile player.has_path_ahead():\n  player.move_forward()\nplayer.turn_right()\n# ... continue o padrão`,
        cpp: `// Use 'while' nas retas para simplificar!\nwhile(player.hasPathAhead()) {\n  player.moveForward();\n}\nplayer.turnRight();\n// ... continue o padrão`,
    }
  },
  {
    id: 51,
    name: "Seguindo a Parede",
    description: "Mantenha a parede à sua direita e avance enquanto houver caminho.",
    grid: [
        [{type: 'start'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'goal'}],
        [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'while'],
    solutionLength: 2,
    codeExamples: {
        javascript: `// Use 'while' com a condição 'pathAhead'.\nwhile (player.hasPathAhead()) {\n  player.moveForward();\n}`,
        python: `# Use 'while' com a condição 'pathAhead'.\nwhile player.has_path_ahead():\n  player.move_forward()`,
        cpp: `// Use 'while' com a condição 'pathAhead'.\nwhile (player.hasPathAhead()) {\n  player.moveForward();\n}`,
    }
  },
  {
    id: 60,
    name: "Serpente",
    description: "Siga o caminho sinuoso.",
    grid: [
        [{type: 'start'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}],
        [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'goal'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 20,
    codeExamples: {
        javascript: `// Muitas voltas pela frente!\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight(); // ...`,
        python: `# Muitas voltas pela frente!\nplayer.move_forward()\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right() # ...`,
        cpp: `// Muitas voltas pela frente!\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight(); // ...`,
    }
  },
  {
    id: 70,
    name: "Precisão Cirúrgica",
    description: "Um movimento errado e você terá que recomeçar.",
    grid: [
        [{type: 'start'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}],
        [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'goal'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'down', hasItem: false},
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 16,
    codeExamples: {
        javascript: `// Planeje cada passo com antecedência.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.turnRight(); // ...`,
        python: `# Planeje cada passo com antecedência.\nplayer.move_forward()\nplayer.move_forward()\nplayer.turn_right()\nplayer.turn_right() # ...`,
        cpp: `// Planeje cada passo com antecedência.\nplayer.moveForward();\nplayer.moveForward();\nplayer.turnRight();\nplayer.turnRight(); // ...`,
    }
  },
  {
    id: 80,
    name: "O Cofre",
    description: "Pegue o item para 'destrancar' o objetivo.",
    grid: [
        [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path', item: true}, {type: 'wall'}, {type: 'wall'}],
        [{type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}],
        [{type: 'start'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}],
        [{type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}],
        [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'goal'}, {type: 'wall'}, {type: 'wall'}],
    ],
    initialPlayerState: {x: 0, y: 2, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 15,
    codeExamples: {
        javascript: `// O caminho para o item é um grande desvio.\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward(); // ...`,
        python: `# O caminho para o item é um grande desvio.\nplayer.move_forward()\nplayer.turn_left()\nplayer.move_forward() # ...`,
        cpp: `// O caminho para o item é um grande desvio.\nplayer.moveForward();\nplayer.turnLeft();\nplayer.moveForward(); // ...`,
    }
  },
  {
    id: 90,
    name: "Quase Lá",
    description: "O fim está próximo, mas os desafios são maiores.",
    grid: [
        [{type: 'start'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'goal'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'down', hasItem: false},
    availableBlocks: ['forward', 'left', 'right'],
    solutionLength: 22,
    codeExamples: {
        javascript: `// Este é um teste de sua habilidade de navegação.\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward(); // ...`,
        python: `# Este é um teste de sua habilidade de navegação.\nplayer.move_forward()\nplayer.move_forward()\nplayer.move_forward() # ...`,
        cpp: `// Este é um teste de sua habilidade de navegação.\nplayer.moveForward();\nplayer.moveForward();\nplayer.moveForward(); // ...`,
    }
  },
  {
    id: 99,
    name: "O Penúltimo Desafio",
    description: "Combine tudo o que você aprendeu.",
    grid: [
        [{type: 'start'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path', item: true}],
        [{type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}],
        [{type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'goal'}, {type: 'wall'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'left', 'right', 'pickup'],
    solutionLength: 25,
    codeExamples: {
        javascript: `// O teste supremo de lógica e planejamento.\n// Boa sorte!\nplayer.moveForward();\nplayer.turnRight(); // ...`,
        python: `# O teste supremo de lógica e planejamento.\n# Boa sorte!\nplayer.move_forward()\nplayer.turn_right() # ...`,
        cpp: `// O teste supremo de lógica e planejamento.\n// Boa sorte!\nplayer.moveForward();\nplayer.turnRight(); // ...`,
    }
  },
  {
    id: 100,
    name: "A Odisséia Final",
    description: "O desafio definitivo. Você é um Mestre dos Blocos?",
    grid: [
        [{type: 'start'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}],
        [{type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}],
        [{type: 'path'}, {type: 'path', item: true}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}],
        [{type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}],
        [{type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'goal'}],
    ],
    initialPlayerState: {x: 0, y: 0, dir: 'right', hasItem: false},
    availableBlocks: ['forward', 'left', 'right', 'pickup', 'repeat'],
    solutionLength: 28,
    codeExamples: {
        javascript: `// O final da jornada. Use toda sua sabedoria.\nplayer.turnRight();\nplayer.turnRight(); //...`,
        python: `# O final da jornada. Use toda sua sabedoria.\nplayer.turn_right()\nplayer.turn_right() #...`,
        cpp: `// O final da jornada. Use toda sua sabedoria.\nplayer.turnRight();\nplayer.turnRight(); //...`,
    }
  },
];