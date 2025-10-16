// ---- Types for Block-based Coding Game ----

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PlayerState {
  x: number;
  y: number;
  dir: Direction;
  hasItem: boolean;
}

export interface Tile {
  type: 'path' | 'wall' | 'goal' | 'start';
  item?: boolean;
}

export type Grid = Tile[][];

export type SimpleBlockType = 'forward' | 'left' | 'right' | 'pickup';
export type ConditionType = 'pathAhead' | 'notAtGoal';
export type LoopBlockType = 'repeat' | 'while';
export type BlockType = SimpleBlockType | LoopBlockType;

export interface ProgramBlock {
    type: BlockType;
    times?: number; // For 'repeat' type
    condition?: ConditionType; // For 'while' type
    maxIterations?: number; // For 'while' type
}

export type Language = 'javascript' | 'python' | 'cpp';


export interface BlockLevel {
  id: number;
  name: string;
  description: string;
  levelType: 'blocks';
  grid: Grid;
  initialPlayerState: PlayerState;
  availableBlocks: BlockType[];
  solutionLength: number; // For star calculation
  codeExamples: {
      [key in Language]: string;
  };
}

export interface CodeQuizQuestion {
  codeSnippet: [string, string]; // Code before and after the blank
  options: string[];
  correctOptionIndex: number;
  explanation: string; // Explanation for the correct answer
}

export interface CodeQuizLevel {
  id: number;
  name: string;
  description: string;
  levelType: 'code-quiz';
  questions: CodeQuizQuestion[];
  language: Language;
}

export type Level = BlockLevel | CodeQuizLevel;


export interface LevelProgress {
    unlocked: boolean;
    stars: number;
}

export interface PlayerProgress {
    [levelId: number]: LevelProgress;
}

export interface ResultState {
    success: boolean;
    levelId: number;
    stars: number;
}

export interface UserProfile {
    email: string;
    preferredLanguage: Language;
}


// ---- Types for Gemini Text Adventure Game ----

export interface StorySegment {
  type: 'player' | 'narrator' | 'error';
  text: string;
}

export interface GameState {
  location: string;
  inventory: string[];
  objective: string;
  gameOver: boolean;
}

export interface GeminiResponse {
  story: string;
  location: string;
  inventory: string[];
  gameOver: boolean;
  objective: string;
}