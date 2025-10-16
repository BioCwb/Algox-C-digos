import type { PlayerState, Level, Grid, SimpleBlockType, ConditionType } from '../types';

/**
 * Executes a single, simple action for the player.
 * @param player The current state of the player.
 * @param block The action to execute (e.g., 'forward', 'left').
 * @param grid The current state of the game grid.
 * @returns An object containing the new player state and the updated grid.
 */
export function executeStep(player: PlayerState, block: SimpleBlockType, grid: Grid): { newPlayerState: PlayerState; grid: Grid } {
  let { x, y, dir, hasItem } = player;
  // Create a deep copy of the grid to avoid modifying the original state directly during execution.
  const newGrid = JSON.parse(JSON.stringify(grid));

  switch (block) {
    case 'forward':
      if (dir === 'right' && x < grid[0].length - 1 && grid[y][x + 1].type !== 'wall') x++;
      if (dir === 'left' && x > 0 && grid[y][x - 1].type !== 'wall') x--;
      if (dir === 'down' && y < grid.length - 1 && grid[y + 1][x].type !== 'wall') y++;
      if (dir === 'up' && y > 0 && grid[y - 1][x].type !== 'wall') y--;
      break;
    case 'left':
      if (dir === 'up') dir = 'left';
      else if (dir === 'left') dir = 'down';
      else if (dir === 'down') dir = 'right';
      else if (dir === 'right') dir = 'up';
      break;
    case 'right':
      if (dir === 'up') dir = 'right';
      else if (dir === 'right') dir = 'down';
      else if (dir === 'down') dir = 'left';
      else if (dir === 'left') dir = 'up';
      break;
    case 'pickup':
        // Check if there's an item on the current tile to pick up.
        if(newGrid[y][x].item) {
            hasItem = true;
            newGrid[y][x].item = false; // Remove the item from the grid.
        }
        break;
  }
  return { newPlayerState: { x, y, dir, hasItem }, grid: newGrid };
}

/**
 * Checks if a given condition for a 'while' loop is true.
 * @param condition The condition to check (e.g., 'pathAhead').
 * @param player The current state of the player.
 * @param grid The current state of the game grid.
 * @returns A boolean indicating whether the condition is met.
 */
export function checkCondition(condition: ConditionType, player: PlayerState, grid: Grid): boolean {
    switch(condition) {
        // Checks if the tile immediately in front of the player is not a wall.
        case 'pathAhead': {
            const { x, y, dir } = player;
            if (dir === 'right') return x < grid[0].length - 1 && grid[y][x + 1].type !== 'wall';
            if (dir === 'left') return x > 0 && grid[y][x - 1].type !== 'wall';
            if (dir === 'down') return y < grid.length - 1 && grid[y + 1][x].type !== 'wall';
            if (dir === 'up') return y > 0 && grid[y - 1][x].type !== 'wall';
            return false;
        }
        // Checks if the player's current tile is not the 'goal' tile.
        case 'notAtGoal': {
            return grid[player.y][player.x].type !== 'goal';
        }
        default:
            return false;
    }
}

/**
 * Determines if the player has successfully completed the level.
 * @param player The final state of the player after the program runs.
 * @param level The level data, including the grid layout.
 * @returns A boolean indicating if the level was successfully completed.
 */
export function checkSuccess(player: PlayerState, level: Level): boolean {
    // FIX: Add a type guard to ensure we only access `grid` on BlockLevel types.
    if (level.levelType !== 'blocks') {
        return false;
    }

    let goalCoords = {x: -1, y: -1};
    // Find the coordinates of the goal tile.
    for(let y=0; y<level.grid.length; y++) {
        for(let x=0; x<level.grid[0].length; x++) {
            if (level.grid[y][x].type === 'goal') {
                goalCoords = {x, y};
                break;
            }
        }
    }

    // Check if the level originally had any items.
    const levelHadItems = level.grid.flat().some(tile => tile.item);
    
    // Check if the player is on the goal tile.
    const atGoal = player.x === goalCoords.x && player.y === goalCoords.y;
    
    // If the level had items, success requires being at the goal AND having picked up an item.
    if (levelHadItems) {
        return atGoal && player.hasItem;
    }
    
    // Otherwise, just being at the goal is enough.
    return atGoal;
}