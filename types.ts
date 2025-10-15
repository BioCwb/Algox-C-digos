
export type Direction = 'up' | 'right' | 'down' | 'left';

export type BlockType = 'forward' | 'left' | 'right' | 'pickup';

export interface PlayerState {
  x: number;
  y: number;
  dir: Direction;
  hasItem: boolean;
}

export interface Tile {
  type: 'player' | 'empty' | 'goal' | 'wall';
  item?: boolean;
}

export type Grid = Tile[][];

export interface Level {
  id: number;
  name: string;
  grid: Grid;
  playerStart: PlayerState;
  availableBlocks: BlockType[];
  solutionLength: number;
}

export interface LevelProgress {
    unlocked: boolean;
    stars: number;
}

export type PlayerProgress = {
    [levelId: number]: LevelProgress;
};

export interface ResultState {
    success: boolean;
    levelId: number;
    stars: number;
}

// FIX: Add missing type definitions for StorySegment, GameState, and GeminiResponse.
export interface StorySegment {
  type: 'player' | 'narrator' | 'error';
  text: string;
}

export interface GameState {
  location: string;
  inventory: string[];
  objective: string;
}

export interface GeminiResponse {
  story: string;
  location: string;
  inventory: string[];
  gameOver: boolean;
  objective: string;
}
