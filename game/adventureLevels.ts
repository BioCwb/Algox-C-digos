export interface AdventureLevel {
  id: number;
  name: string;
  description: string;
  grid: string[][];
  solutionCode: string;
}

export const ADVENTURE_LEVELS: AdventureLevel[] = [
  // Level 1: Inspired by "Olá, Mundo!"
  {
    id: 1,
    name: "Olá, Coelhinho!",
    description: "Sua primeira missão: Diga 'olá' para a cenoura! Use Adiante() para alcançá-la.",
    grid: [
      ['S', 'P', 'P', 'C'],
    ],
    solutionCode: `Adiante()\nAdiante()\nAdiante()`,
  },
  // Level 2: Inspired by simple sequences like Ex 2
  {
    id: 2,
    name: "Primeiros Passos",
    description: "Às vezes, o caminho não é uma linha reta. Use Girar() para mudar de direção.",
    grid: [
      ['S', 'P', 'P'],
      ['X', 'X', 'P'],
      ['X', 'X', 'C'],
    ],
    solutionCode: `Adiante()\nAdiante()\nGirar()\nAdiante()\nAdiante()`,
  },
  // Level 3: Inspired by Ex 6 (Predecessor/Successor)
  {
    id: 3,
    name: "Um Passo Atrás",
    description: "Para avançar, às vezes é preciso recuar. Pegue a cenoura atrás de você.",
    grid: [
      ['C', 'P', 'S'],
    ],
    solutionCode: `// O coelho começa virado para a direita.\n// É preciso virar 180 graus para ir para a esquerda.\nGirar()\nGirar()\nAdiante()\nAdiante()`,
  },
  // Level 4: Inspired by Ex 10 (Painting a wall)
  {
    id: 4,
    name: "Pintando a Cerca",
    description: "O fazendeiro precisa de ajuda. Percorra o perímetro e colete todas as cenouras.",
    grid: [
      ['S', 'P', 'P', 'C'],
      ['P', 'X', 'X', 'P'],
      ['C', 'P', 'P', 'C'],
    ],
    solutionCode: `// Percorrer a borda externa no sentido horário\nAdiante()\nAdiante()\nAdiante()\n\nGirar()\nAdiante()\nAdiante()\n\nGirar()\nAdiante()\nAdiante()\nAdiante()\n\nGirar()\nAdiante()\nAdiante()`,
  },
  // Level 5: Inspired by Ex 14 (Car rental)
  {
    id: 5,
    name: "O Grande Desvio",
    description: "O caminho direto está bloqueado. Encontre uma rota alternativa para a cenoura.",
    grid: [
        ['S', 'P', 'X', 'C'],
        ['P', 'P', 'X', 'P'],
        ['P', 'P', 'P', 'P'],
      ],
    solutionCode: `// Desça, atravesse e suba.\nGirar()\nAdiante()\nAdiante()\n\nGirar()\nGirar()\nGirar()\n\nAdiante()\nAdiante()\nAdiante()\n\nGirar()\nAdiante()\nAdiante()`,
  },
];
