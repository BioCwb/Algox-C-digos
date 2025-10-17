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
    description: "Sua primeira missão: Diga 'olá' para a cenoura! Use a API do player para alcançá-la.",
    grid: [
      ['S', 'P', 'P', 'C'],
    ],
    solutionCode: `// Use um loop para se mover várias vezes
for (let i = 0; i < 3; i++) {
  await player.moveForward();
}`,
  },
  // Level 2: Inspired by "Qual é o seu nome?"
  {
    id: 2,
    name: "Prazer em Conhecer!",
    description: "O coelho quer se apresentar ao 'João da Silva'! Guie-o até a cenoura para que ele possa dizer 'Olá!'.",
    grid: [
      ['S', 'P', 'P'],
      ['X', 'X', 'P'],
      ['X', 'X', 'C'],
    ],
    solutionCode: `await player.moveForward();
await player.moveForward();
await player.turnRight();
await player.moveForward();
await player.moveForward();`,
  },
  // Level 3: Inspired by Ex 6 (Predecessor/Successor)
  {
    id: 3,
    name: "Um Passo Atrás",
    description: "Para avançar, às vezes é preciso recuar. Pegue a cenoura atrás de você.",
    grid: [
      ['C', 'P', 'S'],
    ],
    solutionCode: `// O coelho precisa virar 180 graus.
await player.turnRight();
await player.turnRight();
await player.moveForward();
await player.moveForward();`,
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
    solutionCode: `// Percorra a borda externa no sentido horário
for (let i = 0; i < 3; i++) { await player.moveForward(); }
await player.turnRight();
for (let i = 0; i < 2; i++) { await player.moveForward(); }
await player.turnRight();
for (let i = 0; i < 3; i++) { await player.moveForward(); }
await player.turnRight();
for (let i = 0; i < 2; i++) { await player.moveForward(); }`,
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
    solutionCode: `// Desça, atravesse e suba.
await player.turnRight();
await player.moveForward();
await player.moveForward();
await player.turnLeft();
await player.moveForward();
await player.moveForward();
await player.moveForward();
await player.turnLeft();
await player.moveForward();
await player.moveForward();`,
  },
];